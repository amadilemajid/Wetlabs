import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect:   true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on('error', (err) => logger.error('Redis error', { err }));

export async function checkRedisConnection(): Promise<void> {
  await redis.connect();
  logger.info('Redis connection established');
}
