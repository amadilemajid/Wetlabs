import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}

export const env = {
  NODE_ENV:    process.env['NODE_ENV'] ?? 'development',
  PORT:        parseInt(process.env['PORT'] ?? '3000', 10),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  REDIS_URL:   requireEnv('REDIS_URL'),
  RABBITMQ_URL: requireEnv('RABBITMQ_URL'),
  JWT_PRIVATE_KEY: Buffer.from(requireEnv('JWT_PRIVATE_KEY_BASE64'), 'base64').toString('utf-8'),
  JWT_PUBLIC_KEY:  Buffer.from(requireEnv('JWT_PUBLIC_KEY_BASE64'),  'base64').toString('utf-8'),
  JWT_EXPIRES_IN:  parseInt(process.env['JWT_EXPIRES_IN'] ?? '3600', 10),
  MSISDN_PEPPER:   requireEnv('MSISDN_PEPPER'),
  AT_USSD_HMAC_SECRET: requireEnv('AT_USSD_HMAC_SECRET'),
  INTERNAL_API_KEY:    requireEnv('INTERNAL_API_KEY'),
  AT_API_KEY:          requireEnv('AT_API_KEY'),
  SENDGRID_API_KEY:    requireEnv('SENDGRID_API_KEY'),
  S3_BUCKET:           requireEnv('S3_BUCKET'),
  S3_ENDPOINT:         requireEnv('S3_ENDPOINT'),
} as const;
