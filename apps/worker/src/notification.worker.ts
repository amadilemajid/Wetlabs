import amqplib, { type ConsumeMessage } from 'amqplib';
import { logger } from './logger';

interface SmsPayload { msisdn: string; report_id: string; type: 'CONFIRMATION' | 'ALERT'; message?: string; }

async function sendSms(payload: SmsPayload): Promise<void> {
  const message = payload.type === 'CONFIRMATION'
    ? `WETLABS: Report ${payload.report_id} received. Thank you for monitoring your wetland.`
    : (payload.message ?? `WETLABS ALERT: High severity observation reported. Report: ${payload.report_id}`);

  // Africa's Talking SMS API (SRS Section 6.3)
  const isSandbox = (process.env['AT_USERNAME'] ?? 'sandbox') === 'sandbox';
  const baseUrl = isSandbox 
    ? 'https://api.sandbox.africastalking.com/version1/messaging'
    : 'https://api.africastalking.com/version1/messaging';

  const response = await fetch(baseUrl, {
    method:  'POST',
    headers: {
      'apiKey':       process.env['AT_API_KEY'] ?? '',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept':       'application/json',
    },
    body: new URLSearchParams({
      username: process.env['AT_USERNAME'] ?? 'sandbox',
      to:       payload.msisdn,
      message,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`AT SMS API error: ${response.status} ${await response.text()}`);
  }
  logger.info('SMS sent', { msisdn: payload.msisdn.slice(0, 7) + '***', type: payload.type });
}

export async function startNotificationWorker(): Promise<void> {
  const conn    = await amqplib.connect(process.env['RABBITMQ_URL'] ?? '');
  const channel = await conn.createChannel();
  await channel.assertQueue('wetlabs.notifications.outbound', { durable: true });
  channel.prefetch(5);

  await channel.consume('wetlabs.notifications.outbound', async (msg: ConsumeMessage | null) => {
    if (!msg) return;
    try {
      const envelope = JSON.parse(msg.content.toString()) as { payload: SmsPayload };
      await sendSms(envelope.payload);
      channel.ack(msg);
    } catch (err) {
      logger.error('Notification failed', { err });
      channel.nack(msg, false, false); // drop message to prevent infinite loop
    }
  });

  logger.info('Notification worker listening');
}
