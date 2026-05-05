import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db';
import { getChannel, QUEUES } from '../config/queue';
import { hashMsisdn } from './crypto.service';
import { geoTagReport, isWetlandCodeValid } from './geo.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';
import {
  type WetlandReportDTO, type WetlandReport,
  type ReportFilters, type QueueMessage, type AlertPayload,
} from '@wetlabs/shared-types';

const DUPLICATE_WINDOW_MS = 60 * 60 * 1000; // 60 minutes (SRS FR-04)

export async function ingestReport(dto: WetlandReportDTO): Promise<{ report_id: string }> {
  // Step 1: Validate wetland code (FR-02)
  const valid = await isWetlandCodeValid(dto.wetland_code);
  if (!valid) {
    throw new AppError(422, 'INVALID_WETLAND_CODE', `Unknown wetland code: ${dto.wetland_code}`);
  }

  // Step 2: Pseudonymise MSISDN (NFR-10)
  const reporter_hash = hashMsisdn(dto.reporter_msisdn);

  // Step 3: Geo-tag (FR-03)
  const { longitude, latitude, geo_source } = await geoTagReport(
    dto.wetland_code, dto.latitude, dto.longitude,
  );

  // Step 4: Duplicate detection (FR-04)
  const dupCheck = await db.query(
    `SELECT 1 FROM wetland_reports
      WHERE reporter_hash = $1
        AND wetland_code  = $2
        AND created_at   >= NOW() - INTERVAL '1 hour'
      LIMIT 1`,
    [reporter_hash, dto.wetland_code],
  );
  const is_duplicate = (dupCheck.rowCount ?? 0) > 0;

  // Step 5: Persist
  const result = await db.query<{ report_id: string }>(
    `INSERT INTO wetland_reports
       (report_id, reporter_hash, wetland_code, observation_type, severity,
        description, location_point, geo_source, channel, ussd_session_id,
        is_duplicate, raw_payload, processed_at)
     VALUES
       ($1, $2, $3, $4, $5,
        $6, ST_SetSRID(ST_MakePoint($7, $8), 4326), $9, $10, $11,
        $12, $13, NOW())
     RETURNING report_id`,
    [
      uuidv4(), reporter_hash, dto.wetland_code, dto.observation_type, dto.severity,
      dto.description ?? null,
      longitude, latitude, geo_source, dto.channel, dto.ussd_session_id ?? null,
      is_duplicate, dto.raw_payload ? JSON.stringify(dto.raw_payload) : null,
    ],
  );

  const report_id = result.rows[0]!.report_id;
  logger.info('Report persisted', { report_id, wetland_code: dto.wetland_code, is_duplicate });

  // Step 6: Enqueue HIGH severity alert (FR-06)
  if (dto.severity === 'HIGH') {
    const channel = await getChannel();
    const wetland = await db.query<{ wetland_name: string }>(
      'SELECT wetland_name FROM wetlands WHERE wetland_code = $1', [dto.wetland_code],
    );
    const alert: QueueMessage<AlertPayload> = {
      messageId:  uuidv4(),
      timestamp:  new Date().toISOString(),
      retryCount: 0,
      payload: {
        report_id,
        wetland_code:     dto.wetland_code,
        wetland_name:     wetland.rows[0]?.wetland_name ?? dto.wetland_code,
        observation_type: dto.observation_type,
        severity:         dto.severity,
        created_at:       new Date().toISOString(),
      },
    };
    channel.publish('', QUEUES.ALERTS_OUTBOUND, Buffer.from(JSON.stringify(alert)), {
      persistent: true, contentType: 'application/json',
    });
  }

  return { report_id };
}

export async function queryReports(filters: ReportFilters): Promise<unknown> {
  const conditions: string[] = ['1=1'];
  const params: unknown[]    = [];
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
  if (filters.channel?.length) {
    conditions.push(`r.channel = ANY($${p++}::report_channel[])`);
    params.push(filters.channel);
  }
  if (filters.bbox) {
    conditions.push(
      `ST_Within(r.location_point, ST_MakeEnvelope($${p++},$${p++},$${p++},$${p++},4326))`,
    );
    params.push(...filters.bbox);
  }

  const page     = filters.page     ?? 1;
  const per_page = Math.min(filters.per_page ?? 100, 500);
  const offset   = (page - 1) * per_page;

  const countResult = await db.query<{ total: string }>(
    `SELECT COUNT(*) AS total FROM wetland_reports r WHERE ${conditions.join(' AND ')}`,
    params,
  );
  const total = parseInt(countResult.rows[0]?.total ?? '0', 10);

  const rows = await db.query(
    `SELECT
       r.report_id, r.wetland_code, r.observation_type, r.severity,
       r.channel, r.is_duplicate, r.is_flagged, r.created_at,
       ST_AsGeoJSON(r.location_point)::json AS geometry
     FROM wetland_reports r
     WHERE ${conditions.join(' AND ')}
     ORDER BY r.created_at DESC
     LIMIT $${p++} OFFSET $${p++}`,
    [...params, per_page, offset],
  );

  const features = rows.rows.map((row: Record<string, unknown>) => ({
    type: 'Feature',
    geometry: row['geometry'],
    properties: {
      report_id:        row['report_id'],
      wetland_code:     row['wetland_code'],
      observation_type: row['observation_type'],
      severity:         row['severity'],
      channel:          row['channel'],
      is_duplicate:     row['is_duplicate'],
      is_flagged:       row['is_flagged'],
      created_at:       row['created_at'],
    },
  }));

  return {
    type: 'FeatureCollection',
    features,
    meta: { page, per_page, total },
  };
}
