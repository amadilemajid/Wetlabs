import amqplib, { type ConsumeMessage } from 'amqplib';
import { Pool } from 'pg';
import { logger } from './logger';
import type { AlertPayload, QueueMessage } from '@wetlabs/shared-types';

const db = new Pool({ connectionString: process.env['DATABASE_URL'] });

async function dispatchEmailAlert(payload: AlertPayload, officerEmails: string[]): Promise<void> {
  // SendGrid API (SRS Section 6.3)
  const body = {
    personalizations: officerEmails.map(to => ({ to: [{ email: to }] })),
    from:    { email: 'alerts@wetlabs.app', name: 'WETLABS Alert System' },
    subject: `[HIGH ALERT] ${payload.observation_type} at ${payload.wetland_name}`,
    content: [{
      type:  'text/plain',
      value: [
        `WETLABS HIGH SEVERITY ALERT`,
        ``,
        `Wetland:          ${payload.wetland_name} (${payload.wetland_code})`,
        `Observation Type: ${payload.observation_type}`,
        `Severity:         HIGH`,
        `Report ID:        ${payload.report_id}`,
        `Submitted at:     ${payload.created_at}`,
        ``,
        `View on dashboard: https://app.wetlabs.app/reports/${payload.report_id}`,
      ].join('\n'),
    }],
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${process.env['SENDGRID_API_KEY'] ?? ''}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`SendGrid error: ${response.status}`);
  }
  logger.warn('Alert email dispatched', { report_id: payload.report_id, recipients: officerEmails.length });
}

export async function startAlertWorker(): Promise<void> {
  const conn    = await amqplib.connect(process.env['RABBITMQ_URL'] ?? '');
  const channel = await conn.createChannel();
  await channel.assertQueue('wetlabs.alerts.outbound', { durable: true });
  channel.prefetch(3);

  await channel.consume('wetlabs.alerts.outbound', async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const envelope = JSON.parse(msg.content.toString()) as QueueMessage<AlertPayload>;
      const { payload } = envelope;

      // Find officers assigned to this wetland (SRS FR-033)
      const officers = await db.query<{ email: string }>(
        `SELECT email FROM users
          WHERE $1 = ANY(assigned_wetlands)
            AND role = 'WETLAND_OFFICER'
            AND is_active = TRUE`,
        [payload.wetland_code],
      );

      if (officers.rows.length > 0) {
        const emails = officers.rows.map(r => r.email);
        await dispatchEmailAlert(payload, emails);
      } else {
        logger.warn('No officers found for wetland', { wetland_code: payload.wetland_code });
      }

      channel.ack(msg);
    } catch (err) {
      logger.error('Alert dispatch failed', { err });
      channel.nack(msg, false, false); // DLQ — don't retry alert storms
    }
  });

  logger.info('Alert worker listening');
}
