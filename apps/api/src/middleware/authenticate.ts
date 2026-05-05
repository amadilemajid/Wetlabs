import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { type UserRole } from '@wetlabs/shared-types';

export interface AuthenticatedRequest extends Request {
  user?: { user_id: string; email: string; role: UserRole };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = (req as any).headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'UNAUTHORISED', message: 'Missing Bearer token' });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_PUBLIC_KEY, { algorithms: ['RS256'] }) as {
      sub: string; email: string; role: UserRole;
    };
    req.user = { user_id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'UNAUTHORISED', message: 'Invalid or expired token' });
  }
}

export function authorise(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'FORBIDDEN', message: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
