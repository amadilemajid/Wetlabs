import cron from 'node-cron';
import { checkDbConnection }    from './config/db';
import { checkRedisConnection } from './config/redis';
import { logger } from './config/logger';
import { env }    from './config/env';
import { runSatelliteFetchJob } from './jobs/fetch.job';

async function bootstrap(): Promise<void> {
  logger.info('Starting WETLABS Satellite Fetcher Service');

  await checkDbConnection();
  await checkRedisConnection();

  // Schedule the job based on the cron syntax in .env (FR-10 / US-08 AC5)
  logger.info(`Registering cron schedule: ${env.CRON_SCHEDULE}`);
  
  const scheduledTask = cron.schedule(env.CRON_SCHEDULE, async () => {
    logger.info('Triggering cron-scheduled fetch job...');
    await runSatelliteFetchJob();
  });

  // Run immediately on boot to ensure fresh cache data
  logger.info('Executing immediate startup fetch job...');
  await runSatelliteFetchJob();

  // Graceful shutdown listeners
  const shutdown = (signal: string) => {
    logger.info(`${signal} received — shutting down fetcher service`);
    scheduledTask.stop();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

bootstrap().catch((err: unknown) => {
  logger.error('Fatal satellite-fetcher startup error', { err });
  process.exit(1);
});
