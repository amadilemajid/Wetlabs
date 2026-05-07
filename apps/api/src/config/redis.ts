import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// Mock Redis client that does nothing (for when Redis is unavailable)
class MockRedis {
  async get(_key: string): Promise<null> { return null; }
  async setex(_key: string, _ttl: number, _value: string): Promise<void> {}
  async del(_key: string): Promise<void> {}
  async ping(): Promise<string> { return 'PONG'; }
  async zremrangebyscore(_key: string, _min: number | string, _max: number | string): Promise<number> { return 0; }
  async zcard(_key: string): Promise<number> { return 0; }
  async zadd(_key: string, _score: number, _member: string): Promise<number> { return 0; }
  async pexpire(_key: string, _ms: number): Promise<number> { return 0; }
}

let redisClient: Redis | MockRedis;

try {
  redisClient = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 0,
    enableReadyCheck: false,
    retryStrategy: () => null, // Don't retry
  });
  redisClient.on('error', () => {}); // Suppress errors
} catch {
  logger.warn('Redis initialization failed - using mock client');
  redisClient = new MockRedis();
}

export const redis = redisClient;

export async function checkRedisConnection(): Promise<void> {
  if (redis instanceof MockRedis) {
    logger.info('Using mock Redis client (cache disabled)');
    return;
  }
  try {
    await (redis as Redis).connect();
    logger.info('Redis connection established');
  } catch (err) {
    logger.warn('Redis connection failed - using mock client', { err });
  }
}
