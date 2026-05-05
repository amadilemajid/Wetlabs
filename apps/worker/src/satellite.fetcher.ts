import { Pool }  from 'pg';
import Redis     from 'ioredis';
import { logger } from './logger';

const db    = new Pool({ connectionString: process.env['DATABASE_URL'] });
const redis = new Redis(process.env['REDIS_URL'] ?? '');

const NDVI_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days (SRS FR-10)

interface SentinelToken { access_token: string; }
interface BandStats     { mean: number; min: number; max: number; }

async function getSentinelToken(): Promise<string> {
  const res = await fetch('https://services.sentinel-hub.com/auth/realms/main/protocol/openid-connect/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type:    'client_credentials',
      client_id:     process.env['SENTINEL_HUB_CLIENT_ID']     ?? '',
      client_secret: process.env['SENTINEL_HUB_CLIENT_SECRET'] ?? '',
    }).toString(),
  });
  if (!res.ok) throw new Error(`Sentinel Hub auth failed: ${res.status}`);
  const data = await res.json() as SentinelToken;
  return data.access_token;
}

async function fetchIndexForWetland(
  token:        string,
  wetland_code: string,
  bbox:         [number, number, number, number],
  indexScript:  string,
): Promise<BandStats> {
  const body = {
    input: {
      bounds: { bbox, properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' } },
      data:   [{ type: 'sentinel-2-l2a', dataFilter: { mosaickingOrder: 'leastCC' } }],
    },
    aggregation: {
      timeRange: {
        from: new Date(Date.now() - 30 * 86_400_000).toISOString(),
        to:   new Date().toISOString(),
      },
      aggregationInterval: { of: 'P30D' },
      evalscript: indexScript,
      resx: 0.0001, resy: 0.0001,
    },
    calculations: { default: { statistics: { default: { percentiles: { k: [25,50,75] } } } } },
  };

  const res = await fetch('https://services.sentinel-hub.com/api/v1/statistics', {
    method:  'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Sentinel API error for ${wetland_code}: ${res.status}`);
  const data = await res.json() as { data: Array<{ outputs: { default: { bands: { B0: BandStats } } } }> };
  const band = data.data[0]?.outputs?.default?.bands?.B0;
  if (!band) throw new Error(`No band data for ${wetland_code}`);
  return band;
}

// Evalscripts for NDVI and NDWI
const NDVI_SCRIPT = `//VERSION=3
function setup() { return { input:[{bands:["B04","B08"]}], output:{bands:1,sampleType:"FLOAT32"} }; }
function evaluatePixel(s) { return [(s.B08-s.B04)/(s.B08+s.B04)]; }`;

const NDWI_SCRIPT = `//VERSION=3
function setup() { return { input:[{bands:["B03","B08"]}], output:{bands:1,sampleType:"FLOAT32"} }; }
function evaluatePixel(s) { return [(s.B03-s.B08)/(s.B03+s.B08)]; }`;

export async function runSatelliteFetcher(): Promise<void> {
  logger.info('Satellite fetcher starting');

  const wetlands = await db.query<{
    wetland_code: string;
    bbox: [number, number, number, number];
  }>(
    `SELECT wetland_code,
       ARRAY[
         ST_XMin(boundary_geom), ST_YMin(boundary_geom),
         ST_XMax(boundary_geom), ST_YMax(boundary_geom)
       ] AS bbox
     FROM wetlands WHERE is_active = TRUE`,
  );

  let token: string;
  try {
    token = await getSentinelToken();
  } catch (err) {
    logger.error('Sentinel Hub auth failed — skipping run', { err });
    return;
  }

  for (const wetland of wetlands.rows) {
    const ndviKey = `satellite:ndvi:${wetland.wetland_code}`;
    const ndwiKey = `satellite:ndwi:${wetland.wetland_code}`;

    // Skip if still fresh (NFR-20 — max one fetch per wetland per 7 days)
    const ndviExists = await redis.exists(ndviKey);
    if (ndviExists) {
      logger.debug('Satellite data still fresh, skipping', { wetland_code: wetland.wetland_code });
      continue;
    }

    try {
      const [ndvi, ndwi] = await Promise.all([
        fetchIndexForWetland(token, wetland.wetland_code, wetland.bbox, NDVI_SCRIPT),
        fetchIndexForWetland(token, wetland.wetland_code, wetland.bbox, NDWI_SCRIPT),
      ]);

      const payload = { fetched_at: new Date().toISOString(), stats: { mean: ndvi.mean, min: ndvi.min, max: ndvi.max } };
      const ndwiPayload = { fetched_at: new Date().toISOString(), stats: { mean: ndwi.mean, min: ndwi.min, max: ndwi.max } };

      await redis.setex(ndviKey, NDVI_TTL_SECONDS, JSON.stringify(payload));
      await redis.setex(ndwiKey, NDVI_TTL_SECONDS, JSON.stringify(ndwiPayload));

      logger.info('Satellite indices cached', { wetland_code: wetland.wetland_code, ndvi: ndvi.mean.toFixed(3) });
    } catch (err) {
      logger.error('Failed to fetch satellite data for wetland', { wetland_code: wetland.wetland_code, err });
    }
  }

  logger.info('Satellite fetcher complete');
}
