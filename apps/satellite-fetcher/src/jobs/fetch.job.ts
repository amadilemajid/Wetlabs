import axios  from 'axios';
import { db }    from '../config/db';
import { redis } from '../config/redis';
import { env }   from '../config/env';
import { logger } from '../config/logger';

// FR-10: Retrieve NDVI/NDWI metrics for active wetlands
export async function runSatelliteFetchJob(): Promise<void> {
  logger.info('Satellite Fetch Job: Starting execution...');
  try {
    const { rows: wetlands } = await db.query(
      `SELECT wetland_code, ST_AsGeoJSON(boundary_geom)::json AS geometry
       FROM wetlands WHERE is_active = TRUE`,
    );

    if (wetlands.length === 0) {
      logger.info('Satellite Fetch Job: No active wetlands found.');
      return;
    }

    const useMocks = env.SENTINEL_HUB_CLIENT_ID === 'REPLACE_ME';
    if (useMocks) {
      logger.warn('Satellite Fetch Job: Using algorithmic mocks (No Sentinel Hub credentials)');
    }

    const promises = wetlands.map(async (wetland) => {
      const code = wetland.wetland_code;
      // In a real scenario, we'd pass wetland.geometry to Sentinel Hub's Statistical API
      const { ndvi, ndwi } = useMocks
        ? generateDummyMetrics()
        : await fetchRealMetrics(code, wetland.geometry);

      // Write deep into Redis cache for the API to read (Cache stays valid until tomorrow's job)
      const ttl = 48 * 3600; // 48 hours to account for a skipped job
      await Promise.all([
        redis.setex(`satellite:ndvi:${code}`, ttl, JSON.stringify(ndvi)),
        redis.setex(`satellite:ndwi:${code}`, ttl, JSON.stringify(ndwi)),
      ]);

      logger.info(`Satellite Fetch Job: Metrics updated for ${code}`, { ndvi, ndwi });
    });

    await Promise.all(promises);
    logger.info('Satellite Fetch Job: Completed successfully.');

  } catch (err) {
    logger.error('Satellite Fetch Job: Fatal error', { error: (err as Error).message });
  }
}

// ── Mock Generator ────────────────────────────────────────────────────────
function generateDummyMetrics() {
  const baseNdvi = 0.5 + Math.random() * 0.3; // Generates values between 0.5 - 0.8
  const baseNdwi = Math.random() * 0.4;       // Generates values between 0.0 - 0.4
  return {
    ndvi: parseFloat(baseNdvi.toFixed(3)),
    ndwi: parseFloat(baseNdwi.toFixed(3)),
  };
}

// ── Sentinel Hub Integration ──────────────────────────────────────────────
async function fetchRealMetrics(wetlandCode: string, geometry: unknown): Promise<{ ndvi: number; ndwi: number }> {
  // 1. Request an OAuth token using env.SENTINEL_HUB_CLIENT_ID / SECRET
  // 2. Submit a POST request to https://services.sentinel-hub.com/api/v1/statistics
  // 3. Extract the mean NDVI and NDWI arrays
  // For now, this is a heavy stub that throws if run since it's unreachable without real keys.
  throw new Error(`Real Sentinel Hub fetch not implemented for ${wetlandCode}. Provide real keys.`);
}
