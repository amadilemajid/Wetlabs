import { Router, type Request, type Response, type NextFunction } from 'express';
import Joi from 'joi';
import { loginUser } from '../services/auth.service';
import { rateLimiter } from '../middleware/rateLimiter';
import { AppError }   from '../middleware/errorHandler';
import { env }        from '../config/env';

export const authRouter = Router();

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

// POST /auth/login — rate-limited to 10 req/15 min per IP (NFR-12)
authRouter.post(
  '/login',
  rateLimiter({ windowMs: 15 * 60_000, max: 10, keyPrefix: 'rl:login' }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
      if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }
      const result = await loginUser(value.email as string, value.password as string);
      res.json({ data: result });
    } catch (err) { next(err); }
  },
);

// GET /auth/jwks.json — public key endpoint for JWT verification (NFR-09)
authRouter.get('/jwks.json', (_req: Request, res: Response): void => {
  // Expose the RSA public key as a JWKS endpoint
  // Clients (and the dashboard) can use this to verify JWTs without a round-trip
  res.json({
    keys: [{
      kty: 'RSA',
      use: 'sig',
      alg: 'RS256',
      // In production, parse the PEM and extract n/e properly
      // For MVP, document that consumers use the raw public key PEM
      kid: 'wetlabs-api-key-v1',
      note: 'Use JWT_PUBLIC_KEY_BASE64 env var to verify tokens (RS256)',
    }],
  });
});

// Suppress unused import warning — env is available for future endpoints
void env;
