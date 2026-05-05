import { type Response, type NextFunction } from 'express';
import { db } from '../config/db';
import { logger } from '../config/logger';
import type { AuthenticatedRequest } from './authenticate';

export interface AuditEvent {
  action:      string;
  target_type?: string;
  target_id?:  string;
  meta?:       Record<string, unknown>;
}

// Call this inside any controller that mutates data (SRS NFR-12, US-15)
export async function writeAuditLog(
  req:   AuthenticatedRequest,
  event: AuditEvent,
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO audit_log (actor_id, action, target_type, target_id, meta, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        req.user?.user_id ?? null,
        event.action,
        event.target_type ?? null,
        event.target_id   ?? null,
        event.meta ? JSON.stringify(event.meta) : null,
        req.ip ?? null,
      ],
    );
  } catch (err) {
    // Audit log failure must NEVER crash the main request
    logger.error('Audit log write failed', { err, event });
  }
}
