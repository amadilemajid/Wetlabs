import amqplib, { type Channel, type ChannelModel } from 'amqplib';
import { env } from './env';
import { logger } from './logger';

export const QUEUES = {
  REPORTS_INBOUND:       'wetlabs.reports.inbound',
  REPORTS_INBOUND_DLQ:   'wetlabs.reports.inbound.dlq',
  NOTIFICATIONS_OUTBOUND:'wetlabs.notifications.outbound',
  ALERTS_OUTBOUND:       'wetlabs.alerts.outbound',
} as const;

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export async function getChannel(): Promise<Channel> {
  if (channel) return channel;

  connection = await amqplib.connect(env.RABBITMQ_URL) as ChannelModel;
  channel    = await connection.createChannel();

  // Declare durable queues with DLQ routing (NFR-17, NFR-18)
  await channel!.assertExchange('wetlabs.dlx', 'direct', { durable: true });

  await channel!.assertQueue(QUEUES.REPORTS_INBOUND_DLQ, { durable: true });

  await channel!.assertQueue(QUEUES.REPORTS_INBOUND, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange':    'wetlabs.dlx',
      'x-dead-letter-routing-key': QUEUES.REPORTS_INBOUND_DLQ,
    },
  });

  await channel!.assertQueue(QUEUES.NOTIFICATIONS_OUTBOUND, { durable: true });
  await channel!.assertQueue(QUEUES.ALERTS_OUTBOUND,         { durable: true });

  logger.info('RabbitMQ channel and queues initialised');
  return channel!;
}
