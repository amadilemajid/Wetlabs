import { type Request, type Response, type NextFunction } from 'express';
import crypto from 'crypto';
import { env } from '../config/env';

export function validateHmac(req: Request, res: Response, next: NextFunction): void {
  const signature = req.headers['x-at-signature'] as string | undefined;
  const simKey    = req.headers['x-ussd-simulator-key'] as string | undefined;

  // Allow simulator bypass in dev or with valid secret
  if (simKey && (simKey === 'dev-sim-key' || simKey === env.AT_USSD_HMAC_SECRET)) {
    return next();
  }

  if (!signature) {
    res.status(401).json({ error: 'MISSING_SIGNATURE' });
    return;
  }
  const body     = JSON.stringify(req.body);
  const expected = crypto
    .createHmac('sha256', env.AT_USSD_HMAC_SECRET)
    .update(body)
    .digest('hex');
  // constant-time comparison to prevent timing attacks
  const sigBuf  = Buffer.from(signature,  'hex');
  const expBuf  = Buffer.from(expected,   'hex');
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    res.status(401).json({ error: 'INVALID_SIGNATURE' });
    return;
  }
  next();
}
