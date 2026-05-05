import { type Request, type Response, type NextFunction } from 'express';
import { redis } from '../config/redis';

export function rateLimiter(opts: { windowMs: number; max: number; keyPrefix: string }) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key   = `${opts.keyPrefix}:${req.ip ?? 'unknown'}`;
    const now   = Date.now();
    const floor = now - opts.windowMs;

    await redis.zremrangebyscore(key, '-inf', floor);
    const count = await redis.zcard(key);

    if (count >= opts.max) {
      const retryAfter = Math.ceil(opts.windowMs / 1000);
      res.setHeader('Retry-After', retryAfter);
      res.status(429).json({ error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' });
      return;
    }

    await redis.zadd(key, now, `${now}-${Math.random()}`);
    await redis.pexpire(key, opts.windowMs);
    next();
  };
}
