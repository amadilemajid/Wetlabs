import pg     from 'pg';
import { env }    from './env';
import { logger } from './logger';

export const db = new pg.Pool({ connectionString: env.DATABASE_URL, max: 2 });

export async function checkDbConnection(): Promise<void> {
  const client = await db.connect();
  client.release();
  logger.info('Satellite Fetcher: PostgreSQL connection established');
}
