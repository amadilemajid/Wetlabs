import { Pool } from 'pg';
import { env } from './env';
import { logger } from './logger';

export const db = new Pool({
  connectionString: env.DATABASE_URL,
  max:              20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

db.on('error', (err) => logger.error('Unexpected DB pool error', { err }));

export async function checkDbConnection(): Promise<void> {
  const client = await db.connect();
  await client.query('SELECT 1');
  client.release();
  logger.info('PostgreSQL connection established');
}
