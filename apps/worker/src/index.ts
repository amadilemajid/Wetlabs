import dotenv from 'dotenv';
dotenv.config();

import { startReportWorker }       from './report.worker';
import { startNotificationWorker } from './notification.worker';
import { startAlertWorker }        from './alert.worker';
import { logger }                  from './logger';

async function main(): Promise<void> {
  logger.info('Starting WETLABS Workers');
  await Promise.all([
    startReportWorker(),
    startNotificationWorker(),
    startAlertWorker(),
  ]);
  logger.info('All workers running');
}

main().catch((err: unknown) => {
  logger.error('Worker startup failed', { err });
  process.exit(1);
});
