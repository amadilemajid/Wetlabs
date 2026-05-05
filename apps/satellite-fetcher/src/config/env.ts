import 'dotenv/config';

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

export const env = {
  NODE_ENV:                   process.env['NODE_ENV'] ?? 'development',
  LOG_LEVEL:                  process.env['LOG_LEVEL'] ?? 'info',
  CRON_SCHEDULE:              process.env['CRON_SCHEDULE'] ?? '0 2 * * *',
  DATABASE_URL:               requireEnv('DATABASE_URL'),
  REDIS_URL:                  requireEnv('REDIS_URL'),
  SENTINEL_HUB_CLIENT_ID:     requireEnv('SENTINEL_HUB_CLIENT_ID'),
  SENTINEL_HUB_CLIENT_SECRET: requireEnv('SENTINEL_HUB_CLIENT_SECRET'),
} as const;
