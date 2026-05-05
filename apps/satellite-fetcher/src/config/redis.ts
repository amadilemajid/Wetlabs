import Redis  from 'ioredis';
import { env }    from './env';
import { logger } from './logger';

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

export async function checkRedisConnection(): Promise<void> {
  return new Promise((resolve, reject) => {
    redis.ping((err, res) => {
      if (err || res !== 'PONG') {
        reject(err ?? new Error('Redis PING failed'));
      } else {
        logger.info('Satellite Fetcher: Redis connection established');
        resolve();
      }
    });
  });
}
