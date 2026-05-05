import express from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import compression from 'compression';
import { register } from 'prom-client';

import { env }             from './config/env';
import { logger }          from './config/logger';
import { checkDbConnection } from './config/db';
import { checkRedisConnection } from './config/redis';
import { requestLogger }   from './middleware/requestLogger';
import { errorHandler }    from './middleware/errorHandler';
import { apiRouter }       from './routes/index';

async function bootstrap(): Promise<void> {
  // Validate all env vars before anything else
  logger.info('Starting WETLABS API', { env: env.NODE_ENV, port: env.PORT });

  await checkDbConnection();
  await checkRedisConnection();

  const app = express();

  // ── Security headers (NFR-07) ─────────────────────────────────────────────
  app.use(helmet());
  app.use(helmet.hsts({ maxAge: 31_536_000, includeSubDomains: true }));

  // ── Core middleware ───────────────────────────────────────────────────────
  app.use(cors({ origin: process.env['CORS_ORIGIN'] ?? '*', credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // ── Prometheus metrics endpoint (NFR-21) ──────────────────────────────────
  app.get('/metrics', async (_req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  });

  // ── API routes ────────────────────────────────────────────────────────────
  app.use('/api/v1', apiRouter);

  // ── 404 handler ───────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Route not found' });
  });

  // ── Global error boundary ─────────────────────────────────────────────────
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    logger.info(`WETLABS API listening on port ${env.PORT}`);
  });
}

bootstrap().catch((err: unknown) => {
  logger.error('Fatal startup error', { err });
  process.exit(1);
});
