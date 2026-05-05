import { Router, type Request, type Response, type NextFunction } from 'express';
import { authenticate, authorise } from '../middleware/authenticate';
import { rateLimiter } from '../middleware/rateLimiter';
import { db }          from '../config/db';
import { AppError }    from '../middleware/errorHandler';
import { logger }      from '../config/logger';
import Joi             from 'joi';
import type { ReportFilters } from '@wetlabs/shared-types';
import QueryCursor from 'pg-cursor'; // cursor-based streaming (FR-12: never buffer full dataset)

export const exportRouter = Router();

const exportQuerySchema = Joi.object({
  wetland_code:     Joi.string().alphanum().max(20),
  from:             Joi.string().isoDate(),
  to:               Joi.string().isoDate(),
  severity:         Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  observation_type: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
});

function buildExportQuery(filters: ReportFilters): { sql: string; params: unknown[] } {
  const conditions: string[] = ['1=1'];
  const params:     unknown[]= [];
  let p = 1;

  if (filters.wetland_code) {
    conditions.push(`r.wetland_code = $${p++}`); params.push(filters.wetland_code);
  }
  if (filters.from) {
    conditions.push(`r.created_at >= $${p++}`); params.push(filters.from);
  }
  if (filters.to) {
    conditions.push(`r.created_at <= $${p++}`); params.push(filters.to);
  }
  if (filters.severity?.length) {
    conditions.push(`r.severity = ANY($${p++}::severity_level[])`);
    params.push(filters.severity);
  }
  if (filters.observation_type?.length) {
    conditions.push(`r.observation_type = ANY($${p++}::observation_type[])`);
    params.push(filters.observation_type);
  }

  const sql = `
    SELECT r.report_id, r.wetland_code, w.wetland_name, r.observation_type,
           r.severity, r.channel, r.geo_source, r.description,
           ST_Y(r.location_point) AS latitude,
           ST_X(r.location_point) AS longitude,
           r.is_duplicate, r.is_flagged, r.created_at, r.processed_at
    FROM wetland_reports r
    JOIN wetlands w ON w.wetland_code = r.wetland_code
    WHERE ${conditions.join(' AND ')}
    ORDER BY r.created_at DESC
    LIMIT 50001`; // +1 to detect over-limit without full scan (SRS: max 50,000)

  return { sql, params };
}

// GET /export/reports.csv — streaming CSV (SRS FR-12, FR-17, US-10)
exportRouter.get(
  '/reports.csv',
  authenticate,
  authorise('RESEARCHER', 'SYSTEM_ADMIN'),
  rateLimiter({ windowMs: 60_000, max: 10, keyPrefix: 'rl:export' }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const client = await db.connect();
    try {
      const { error, value } = exportQuerySchema.validate(req.query);
      if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }

      const filters: ReportFilters = {
        ...value as ReportFilters,
        severity:         value.severity         ? [value.severity].flat()         : undefined,
        observation_type: value.observation_type ? [value.observation_type].flat() : undefined,
      };

      const { sql, params } = buildExportQuery(filters);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="wetlabs_reports_${Date.now()}.csv"`);

      // Stream via pg cursor — no full-dataset buffering in memory (FR-12)
      const cursor = client.query(new QueryCursor(sql, params));
      const CSV_HEADERS = [
        'report_id','wetland_code','wetland_name','observation_type','severity',
        'channel','geo_source','description','latitude','longitude',
        'is_duplicate','is_flagged','created_at','processed_at',
      ];
      res.write(CSV_HEADERS.join(',') + '\n');

      let rowCount = 0;
      const readBatch = (): void => {
        cursor.read(500, (err: Error | undefined, rows: Record<string, unknown>[]) => {
          if (err) {
            logger.error('CSV export cursor error', { err });
            res.end();
            client.release();
            return;
          }
          if (rowCount === 0 && rows.length > 50_000) {
            res.destroy(new Error('TOO_MANY_ROWS'));
            client.release();
            return;
          }
          if (rows.length === 0) {
            res.end();
            client.release();
            return;
          }
          for (const row of rows) {
            if (rowCount >= 50_000) { res.end(); client.release(); return; }
            const line = CSV_HEADERS.map(h => {
              const val = row[h];
              if (val === null || val === undefined) return '';
              const str = (typeof val === 'object' && !(val instanceof Date)) ? JSON.stringify(val) : String(val);
              return str.includes(',') || str.includes('"') ? `"${str.replaceAll('"', '""')}"` : str;
            }).join(',');
            res.write(line + '\n');
            rowCount++;
          }
          readBatch(); // recurse for next batch
        });
      };
      readBatch();

    } catch (err) {
      client.release();
      next(err);
    }
  },
);

// GET /export/reports.geojson — streaming GeoJSON (SRS Section 4.5)
exportRouter.get(
  '/reports.geojson',
  authenticate,
  authorise('RESEARCHER', 'SYSTEM_ADMIN'),
  rateLimiter({ windowMs: 60_000, max: 10, keyPrefix: 'rl:export' }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const client = await db.connect();
    try {
      const { error, value } = exportQuerySchema.validate(req.query);
      if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }

      const filters: ReportFilters = {
        ...value as ReportFilters,
        severity:         value.severity         ? [value.severity].flat()         : undefined,
        observation_type: value.observation_type ? [value.observation_type].flat() : undefined,
      };

      const { sql, params } = buildExportQuery(filters);

      res.setHeader('Content-Type', 'application/geo+json');
      res.setHeader('Content-Disposition', `attachment; filename="wetlabs_reports_${Date.now()}.geojson"`);

      res.write('{"type":"FeatureCollection","features":[\n');
      const cursor = client.query(new QueryCursor(sql, params));
      let first    = true;
      let rowCount = 0;

      const readBatch = (): void => {
        cursor.read(500, (err: Error | undefined, rows: Record<string, unknown>[]) => {
          if (err || rows.length === 0) {
            res.write('\n]}');
            res.end();
            client.release();
            return;
          }
          for (const row of rows) {
            if (rowCount >= 50_000) { res.write('\n]}'); res.end(); client.release(); return; }
            const feature = JSON.stringify({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [Number(row['longitude']), Number(row['latitude'])],
              },
              properties: {
                report_id:        row['report_id'],
                wetland_code:     row['wetland_code'],
                wetland_name:     row['wetland_name'],
                observation_type: row['observation_type'],
                severity:         row['severity'],
                channel:          row['channel'],
                description:      row['description'],
                created_at:       row['created_at'],
              },
            });
            res.write((first ? '' : ',\n') + feature);
            first = false;
            rowCount++;
          }
          readBatch();
        });
      };
      readBatch();

    } catch (err) {
      client.release();
      next(err);
    }
  },
);
