import amqplib, { type Channel, type ConsumeMessage } from 'amqplib';
import { Pool } from 'pg';
import crypto   from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';
import type { QueueMessage, WetlandReportDTO, AlertPayload } from '@wetlabs/shared-types';

const QUEUES = {
  REPORTS_INBOUND:        'wetlabs.reports.inbound',
  REPORTS_INBOUND_DLQ:    'wetlabs.reports.inbound.dlq',
  NOTIFICATIONS_OUTBOUND: 'wetlabs.notifications.outbound',
  ALERTS_OUTBOUND:        'wetlabs.alerts.outbound',
} as const;

const MAX_RETRIES = 3; // SRS NFR-18

const db = new Pool({ connectionString: process.env['DATABASE_URL'] });

function hashMsisdn(msisdn: string): string {
  return crypto
    .createHmac('sha256', process.env['MSISDN_PEPPER'] ?? '')
    .update(msisdn)
    .digest('hex');
}

async function processReport(dto: WetlandReportDTO, channel: Channel): Promise<void> {
  // 1. Validate wetland code
  const wetlandResult = await db.query<{ wetland_name: string; centroid_lon: number; centroid_lat: number }>(
    `SELECT wetland_name,
            ST_X(centroid_geom) AS centroid_lon,
            ST_Y(centroid_geom) AS centroid_lat
       FROM wetlands WHERE wetland_code = $1 AND is_active = TRUE`,
    [dto.wetland_code],
  );
  if (!wetlandResult.rows[0]) {
    // Publish correction SMS notification and throw to DLQ
    throw new Error(`Invalid wetland code: ${dto.wetland_code}`);
  }

  const wetland    = wetlandResult.rows[0];
  const reporterHash = hashMsisdn(dto.reporter_msisdn);

  // 2. Geo-tag
  const longitude  = dto.longitude ?? wetland.centroid_lon;
  const latitude   = dto.latitude  ?? wetland.centroid_lat;
  const geo_source = (dto.longitude !== undefined) ? 'GPS' : 'CENTROID';

  // 3. Duplicate detection
  const dupCheck = await db.query(
    `SELECT 1 FROM wetland_reports
      WHERE reporter_hash = $1 AND wetland_code = $2
        AND created_at >= NOW() - INTERVAL '1 hour' LIMIT 1`,
    [reporterHash, dto.wetland_code],
  );
  const is_duplicate = (dupCheck.rowCount ?? 0) > 0;

  // 4. Persist
  const insertResult = await db.query<{ report_id: string }>(
    `INSERT INTO wetland_reports
       (report_id, reporter_hash, wetland_code, observation_type, severity,
        description, location_point, geo_source, channel, ussd_session_id,
        is_duplicate, raw_payload, processed_at)
     VALUES
       ($1,$2,$3,$4,$5,$6,
        ST_SetSRID(ST_MakePoint($7,$8),4326),
        $9,$10,$11,$12,$13,NOW())
     RETURNING report_id`,
    [
      uuidv4(), reporterHash, dto.wetland_code, dto.observation_type, dto.severity,
      dto.description ?? null, longitude, latitude, geo_source,
      dto.channel, dto.ussd_session_id ?? null,
      is_duplicate, dto.raw_payload ? JSON.stringify(dto.raw_payload) : null,
    ],
  );

  const report_id = insertResult.rows[0]!.report_id;
  logger.info('Report persisted by worker', { report_id, is_duplicate });

  // 5. Enqueue confirmation SMS
  const smsPayload = JSON.stringify({
    messageId: uuidv4(), timestamp: new Date().toISOString(), retryCount: 0,
    payload: { msisdn: dto.reporter_msisdn, report_id, type: 'CONFIRMATION' },
  });
  channel.sendToQueue(QUEUES.NOTIFICATIONS_OUTBOUND, Buffer.from(smsPayload), {
    persistent: true, contentType: 'application/json',
  });

  // 6. HIGH severity alert
  if (dto.severity === 'HIGH') {
    const alertPayload: QueueMessage<AlertPayload> = {
      messageId: uuidv4(), timestamp: new Date().toISOString(), retryCount: 0,
      payload: {
        report_id, wetland_code: dto.wetland_code,
        wetland_name: wetland.wetland_name,
        observation_type: dto.observation_type,
        severity: dto.severity, created_at: new Date().toISOString(),
      },
    };
    channel.sendToQueue(QUEUES.ALERTS_OUTBOUND, Buffer.from(JSON.stringify(alertPayload)), {
      persistent: true, contentType: 'application/json',
    });
    logger.warn('HIGH severity alert enqueued', { report_id });
  }
}

export async function startReportWorker(): Promise<void> {
  const conn    = await amqplib.connect(process.env['RABBITMQ_URL'] ?? '');
  const channel = await conn.createChannel();

  await channel.assertExchange('wetlabs.dlx', 'direct', { durable: true });
  await channel.assertQueue(QUEUES.REPORTS_INBOUND_DLQ, { durable: true });
  await channel.assertQueue(QUEUES.REPORTS_INBOUND, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange':    'wetlabs.dlx',
      'x-dead-letter-routing-key': QUEUES.REPORTS_INBOUND_DLQ,
    },
  });
  await channel.assertQueue(QUEUES.NOTIFICATIONS_OUTBOUND, { durable: true });
  await channel.assertQueue(QUEUES.ALERTS_OUTBOUND,         { durable: true });

  channel.prefetch(10); // Process 10 messages at a time

  await channel.consume(QUEUES.REPORTS_INBOUND, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    let envelope: QueueMessage<WetlandReportDTO>;
    try {
      envelope = JSON.parse(msg.content.toString()) as QueueMessage<WetlandReportDTO>;
    } catch {
      logger.error('Unparseable message — moving to DLQ', { raw: msg.content.toString() });
      channel.nack(msg, false, false); // reject, send to DLQ
      return;
    }

    try {
      await processReport(envelope.payload, channel);
      channel.ack(msg);
    } catch (err) {
      const retries = (envelope.retryCount ?? 0) + 1;
      logger.error('Report processing failed', { err, retries, messageId: envelope.messageId });

      if (retries >= MAX_RETRIES) {
        logger.error('Max retries exceeded — sending to DLQ', { messageId: envelope.messageId });
        channel.nack(msg, false, false); // to DLQ
      } else {
        // Requeue with incremented retry count after short delay
        const retryEnvelope = { ...envelope, retryCount: retries };
        setTimeout(() => {
          channel.sendToQueue(
            QUEUES.REPORTS_INBOUND,
            Buffer.from(JSON.stringify(retryEnvelope)),
            { persistent: true },
          );
          channel.ack(msg);
        }, 2_000 * retries); // exponential-ish back-off
      }
    }
  });

  logger.info('Report worker listening', { queue: QUEUES.REPORTS_INBOUND });
}
