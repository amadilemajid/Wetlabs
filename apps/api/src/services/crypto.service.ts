import crypto from 'crypto';
import { env } from '../config/env';

export function hashMsisdn(msisdn: string): string {
  return crypto
    .createHmac('sha256', env.MSISDN_PEPPER)
    .update(msisdn)
    .digest('hex');
}
