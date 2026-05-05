import { db } from '../config/db';
import { type GeoSource } from '@wetlabs/shared-types';
import { AppError } from '../middleware/errorHandler';

export interface GeoTagResult {
  longitude:  number;
  latitude:   number;
  geo_source: GeoSource;
}

export async function geoTagReport(
  wetland_code: string,
  latitude?:    number,
  longitude?:   number,
): Promise<GeoTagResult> {
  if (latitude !== undefined && longitude !== undefined) {
    return { latitude, longitude, geo_source: 'GPS' };
  }
  // Fall back to centroid of matched wetland polygon (FR-03)
  const result = await db.query<{ lon: number; lat: number }>(
    `SELECT ST_X(centroid_geom) AS lon, ST_Y(centroid_geom) AS lat
       FROM wetlands
      WHERE wetland_code = $1 AND is_active = TRUE`,
    [wetland_code],
  );
  if (!result.rows[0]) {
    throw new AppError(422, 'INVALID_WETLAND_CODE', `Wetland '${wetland_code}' not found`);
  }
  return {
    longitude:  result.rows[0].lon,
    latitude:   result.rows[0].lat,
    geo_source: 'CENTROID',
  };
}

export async function isWetlandCodeValid(wetland_code: string): Promise<boolean> {
  const result = await db.query(
    'SELECT 1 FROM wetlands WHERE wetland_code = $1 AND is_active = TRUE',
    [wetland_code],
  );
  return (result.rowCount ?? 0) > 0;
}
