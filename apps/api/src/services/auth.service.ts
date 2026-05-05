import bcrypt from 'bcryptjs';
import jwt    from 'jsonwebtoken';
import { db }  from '../config/db';
import { redis } from '../config/redis';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { AppError } from '../middleware/errorHandler';
import type { User, UserRole } from '@wetlabs/shared-types';

const BCRYPT_COST = 12; // SRS NFR-31

export interface LoginResult {
  access_token: string;
  expires_in:   number;
  role:         UserRole;
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  const result = await db.query<User & { password_hash: string }>(
    `SELECT user_id, email, full_name, role, password_hash, is_active
       FROM users WHERE email = $1 LIMIT 1`,
    [email.toLowerCase().trim()],
  );

  const user = result.rows[0];

  // Use constant-time compare even for missing users (prevent user enumeration)
  const dummyHash = '$2b$12$invalidhashfortimingnormalisation000000000000000000000';
  const hashToCompare = user?.password_hash ?? dummyHash;
  const passwordMatch = await bcrypt.compare(password, hashToCompare);

  if (!user || !passwordMatch || !user.is_active) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }

  // Issue RS256 JWT
  const payload = { sub: user.user_id, email: user.email, role: user.role };
  const access_token = jwt.sign(payload, env.JWT_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: env.JWT_EXPIRES_IN,
  });

  // Update last_login_at
  await db.query(
    'UPDATE users SET last_login_at = NOW() WHERE user_id = $1',
    [user.user_id],
  );

  logger.info('User login successful', { user_id: user.user_id, role: user.role });

  return { access_token, expires_in: env.JWT_EXPIRES_IN, role: user.role };
}

export async function registerUser(data: {
  email: string; password: string; full_name: string;
  role: UserRole; assigned_wetlands: string[];
}): Promise<{ user_id: string }> {
  const existing = await db.query(
    'SELECT 1 FROM users WHERE email = $1', [data.email.toLowerCase().trim()],
  );
  if ((existing.rowCount ?? 0) > 0) {
    throw new AppError(409, 'EMAIL_TAKEN', 'A user with this email already exists');
  }

  const password_hash = await bcrypt.hash(data.password, BCRYPT_COST);

  const result = await db.query<{ user_id: string }>(
    `INSERT INTO users (email, password_hash, full_name, role, assigned_wetlands)
     VALUES ($1, $2, $3, $4, $5) RETURNING user_id`,
    [data.email.toLowerCase().trim(), password_hash, data.full_name, data.role, data.assigned_wetlands],
  );

  logger.info('User registered', { user_id: result.rows[0]!.user_id, role: data.role });
  return { user_id: result.rows[0]!.user_id };
}

// Invalidate all active sessions for a user (SRS US-13 AC3)
export async function invalidateUserSessions(user_id: string): Promise<void> {
  await redis.del(`user:session:${user_id}`);
  logger.info('Sessions invalidated', { user_id });
}
