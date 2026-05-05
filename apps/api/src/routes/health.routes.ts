import { Router, type Request, type Response } from 'express';
import { db }    from '../config/db';
import { redis } from '../config/redis';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  const [dbOk, redisOk] = await Promise.all([
    db.query('SELECT 1').then(() => true).catch(() => false),
    redis.ping().then((r) => r === 'PONG').catch(() => false),
  ]);
  const status = dbOk && redisOk ? 200 : 503;
  res.status(status).json({
    status: status === 200 ? 'ok' : 'degraded',
    db:     dbOk    ? 'ok' : 'error',
    redis:  redisOk ? 'ok' : 'error',
    uptime: process.uptime(),
  });
});
