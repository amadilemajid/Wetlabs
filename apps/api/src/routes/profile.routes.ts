import { Router, type Request, type Response, type NextFunction } from 'express';
import { authenticate, authorise } from '../middleware/authenticate';
import { db } from '../config/db';
import { AppError } from '../middleware/errorHandler';
import crypto from 'crypto';
import Joi from 'joi';

export const profileRouter = Router();

profileRouter.use(authenticate);

// List API keys
profileRouter.get('/api-keys', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await db.query(
      `SELECT key_id, description, prefix, created_at, last_used_at FROM user_api_keys WHERE user_id = $1 ORDER BY created_at DESC`,
      [user.user_id]
    );
    res.json({ data: result.rows });
  } catch (err) { next(err); }
});

// Create API key
profileRouter.post('/api-keys', authorise('RESEARCHER', 'SYSTEM_ADMIN'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schema = Joi.object({ description: Joi.string().max(100).optional().allow('') });
    const { error, value } = schema.validate(req.body);
    if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }

    const user = (req as any).user;
    const rawKey = crypto.randomBytes(32).toString('hex');
    const prefix = rawKey.substring(0, 8);
    
    // Hash key using SHA256
    const key_hash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const result = await db.query(
      `INSERT INTO user_api_keys (user_id, description, key_hash, prefix) VALUES ($1, $2, $3, $4) RETURNING key_id, description, prefix, created_at`,
      [user.user_id, value.description, key_hash, prefix]
    );

    // Return the raw key ONLY once on creation
    res.status(201).json({ data: { ...result.rows[0], key: rawKey } });
  } catch (err) { next(err); }
});

// Delete API key
profileRouter.delete('/api-keys/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user;
    const result = await db.query(`DELETE FROM user_api_keys WHERE key_id = $1 AND user_id = $2 RETURNING key_id`, [req.params['id'], user.user_id]);
    if (result.rowCount === 0) throw new AppError(404, 'NOT_FOUND', 'API key not found');
    res.json({ data: { success: true } });
  } catch (err) { next(err); }
});
