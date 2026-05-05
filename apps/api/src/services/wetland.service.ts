import { db }    from '../config/db';
import { redis } from '../config/redis';
import { logger } from '../config/logger';

const WETLAND_CACHE_TTL = 300; // 5 minutes — boundaries don't change often

export async function getAllWetlands(): Promise<unknown> {
  const cacheKey = 'cache:wetlands:geojson';
  const cached   = await redis.get(cacheKey);
  if (cached) {
    logger.debug('Wetlands served from cache');
    return JSON.parse(cached) as unknown;
  }

  const result = await db.query(
    `SELECT
       wetland_code, wetland_name, region, catchment, area_ha, gazette_ref,
       ST_AsGeoJSON(boundary_geom)::json AS geometry
     FROM wetlands
     WHERE is_active = TRUE
     ORDER BY wetland_name`,
  );

  const geojson = {
    type: 'FeatureCollection',
    features: result.rows.map((row: Record<string, unknown>) => ({
      type: 'Feature',
      geometry: row['geometry'],
      properties: {
        wetland_code: row['wetland_code'],
        wetland_name: row['wetland_name'],
        region:       row['region'],
        catchment:    row['catchment'],
        area_ha:      row['area_ha'],
        gazette_ref:  row['gazette_ref'],
      },
    })),
  };

  await redis.setex(cacheKey, WETLAND_CACHE_TTL, JSON.stringify(geojson));
  return geojson;
}

export async function getWetlandSummary(
  wetland_code: string,
  from?: string,
  to?: string,
): Promise<unknown> {
  const cacheKey = `cache:wetland:summary:${wetland_code}:${from ?? 'default'}:${to ?? 'default'}`;
  const cached   = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached) as unknown;

  const fromDate = from ?? new Date(Date.now() - 30 * 86_400_000).toISOString();
  const toDate   = to   ?? new Date().toISOString();

  // Weekly time-series for trend chart (US-11)
  const timeSeries = await db.query(
    `SELECT
       DATE_TRUNC('week', created_at) AS week,
       observation_type,
       COUNT(*)                        AS count
     FROM wetland_reports
     WHERE wetland_code = $1 AND created_at BETWEEN $2 AND $3
     GROUP BY week, observation_type
     ORDER BY week ASC`,
    [wetland_code, fromDate, toDate],
  );

  // Separate aggregates (avoid cross-join that inflates totals)
  const [totalRes, byTypeRes, bySeverityRes] = await Promise.all([
    db.query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM wetland_reports
       WHERE wetland_code = $1 AND created_at BETWEEN $2 AND $3`,
      [wetland_code, fromDate, toDate],
    ),
    db.query(
      `SELECT observation_type, COUNT(*) AS count FROM wetland_reports
       WHERE wetland_code = $1 AND created_at BETWEEN $2 AND $3
       GROUP BY observation_type ORDER BY count DESC`,
      [wetland_code, fromDate, toDate],
    ),
    db.query(
      `SELECT severity, COUNT(*) AS count FROM wetland_reports
       WHERE wetland_code = $1 AND created_at BETWEEN $2 AND $3
       GROUP BY severity ORDER BY count DESC`,
      [wetland_code, fromDate, toDate],
    ),
  ]);

  // Latest NDVI/NDWI from cache (populated by satellite-fetcher cron, FR-10)
  const ndviKey  = `satellite:ndvi:${wetland_code}`;
  const ndwiKey  = `satellite:ndwi:${wetland_code}`;
  const [ndviRaw, ndwiRaw] = await Promise.all([redis.get(ndviKey), redis.get(ndwiKey)]);
  const ndvi = ndviRaw ? (JSON.parse(ndviRaw) as unknown) : null;
  const ndwi = ndwiRaw ? (JSON.parse(ndwiRaw) as unknown) : null;

  const summary = {
    wetland_code,
    period:      { from: fromDate, to: toDate },
    total_reports: parseInt(totalRes.rows[0]?.total ?? '0', 10),
    by_type:     byTypeRes.rows,
    by_severity: bySeverityRes.rows,
    time_series: timeSeries.rows,
    satellite:   { 
      ndvi, 
      ndwi, 
      stale: !ndviRaw,
      ndvi_url: `https://services.sentinel-hub.com/ogc/wms/mock-token?REQUEST=GetMap&LAYERS=NDVI&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png`,
      ndwi_url: `https://services.sentinel-hub.com/ogc/wms/mock-token?REQUEST=GetMap&LAYERS=NDWI&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png`,
      lulc_url: `https://services.sentinel-hub.com/ogc/wms/mock-token?REQUEST=GetMap&LAYERS=LULC&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png`,
      dem_url:  `https://services.sentinel-hub.com/ogc/wms/mock-token?REQUEST=GetMap&LAYERS=DEM&CRS=EPSG:3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256&FORMAT=image/png`
    },
  };

  await redis.setex(cacheKey, 120, JSON.stringify(summary)); // 2 min cache
  return summary;
}
