import { Router, type Request, type Response, type NextFunction } from 'express';
import { authenticate, authorise } from '../middleware/authenticate';
import { rateLimiter }   from '../middleware/rateLimiter';
import { db }            from '../config/db';
import { registerUser, invalidateUserSessions } from '../services/auth.service';
import { AppError }      from '../middleware/errorHandler';
import { getChannel, QUEUES } from '../config/queue';
import Joi               from 'joi';
import type { UserRole } from '@wetlabs/shared-types';

export const adminRouter = Router();

// All admin routes require SYSTEM_ADMIN role
adminRouter.use(authenticate);
adminRouter.use(authorise('SYSTEM_ADMIN'));
adminRouter.use(rateLimiter({ windowMs: 60_000, max: 60, keyPrefix: 'rl:admin' }));

// ── GET /admin/users — list all users (US-13 AC1) ─────────────────────────
adminRouter.get('/users', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await db.query(
      `SELECT user_id, email, full_name, role, assigned_wetlands,
              is_active, last_login_at, created_at
         FROM users ORDER BY created_at DESC`,
    );
    res.json({ data: result.rows, meta: { total: result.rowCount } });
  } catch (err) { next(err); }
});

// ── POST /admin/users — create user (US-13 AC2) ───────────────────────────
const createUserSchema = Joi.object({
  email:             Joi.string().email().required(),
  password:          Joi.string().min(10).max(128).required(),
  full_name:         Joi.string().min(2).max(200).required(),
  role:              Joi.string().valid(
    'FIELD_ENUMERATOR','WETLAND_OFFICER','RESEARCHER','NGO_PARTNER','SYSTEM_ADMIN',
  ).required(),
  assigned_wetlands: Joi.array().items(Joi.string().alphanum().max(20)).min(1).required(),
});

adminRouter.post('/users', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
    if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }
    const result = await registerUser({
      email:             value.email as string,
      password:          value.password as string,
      full_name:         value.full_name as string,
      role:              value.role as UserRole,
      assigned_wetlands: value.assigned_wetlands as string[],
    });
    res.status(201).json({ data: result });
  } catch (err) { next(err); }
});

// ── PATCH /admin/users/:id — update role or status ─────────────────────────
adminRouter.patch('/users/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schema = Joi.object({
      role:              Joi.string().valid('FIELD_ENUMERATOR','WETLAND_OFFICER','RESEARCHER','NGO_PARTNER','SYSTEM_ADMIN'),
      is_active:         Joi.boolean(),
      assigned_wetlands: Joi.array().items(Joi.string().alphanum().max(20)),
    }).min(1);
    const { error, value } = schema.validate(req.body);
    if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }

    const setClauses: string[] = [];
    const params:     unknown[] = [];
    let p = 1;

    if (value.role              !== undefined) { setClauses.push(`role = $${p++}`);              params.push(value.role); }
    if (value.is_active         !== undefined) { setClauses.push(`is_active = $${p++}`);         params.push(value.is_active); }
    if (value.assigned_wetlands !== undefined) { setClauses.push(`assigned_wetlands = $${p++}`); params.push(value.assigned_wetlands); }

    params.push(req.params['id']);
    await db.query(
      `UPDATE users SET ${setClauses.join(', ')} WHERE user_id = $${p}`,
      params,
    );

    // Invalidate sessions if deactivating (US-13 AC3)
    if (value.is_active === false) {
      await invalidateUserSessions(String(req.params['id']));
    }

    res.json({ data: { updated: true } });
  } catch (err) { next(err); }
});

// ── GET /admin/queue/dlq — view DLQ messages (US-14) ─────────────────────
adminRouter.get('/queue/dlq', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Fetch DLQ depth from RabbitMQ Management API
    const auth    = Buffer.from(`wetlabs:wetlabs_secret`).toString('base64');
    const rmqHost = process.env['RABBITMQ_MANAGEMENT_URL'] ?? 'http://localhost:15672';
    
    // Get depth
    const rmqRes  = await fetch(
      `${rmqHost}/api/queues/%2F/wetlabs.reports.inbound.dlq`,
      { headers: { 'Authorization': `Basic ${auth}` } },
    );
    if (!rmqRes.ok) throw new AppError(502, 'QUEUE_ERROR', 'Cannot reach RabbitMQ management API');
    const queueInfo = await rmqRes.json() as { messages: number; message_stats?: unknown };
    
    // Get up to 10 messages from DLQ without acking (peeking)
    const msgsRes = await fetch(
      `${rmqHost}/api/queues/%2F/wetlabs.reports.inbound.dlq/get`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 10, ackmode: 'ack_requeue_true', encoding: 'auto', truncate: 50000 }),
      }
    );
    const msgsData = msgsRes.ok ? await msgsRes.json() as Array<{ payload: string; routing_key: string }> : [];
    
    const messages = msgsData.map((m) => {
       try {
          return JSON.parse(m.payload);
       } catch {
          return { error: 'unparseable', raw: m.payload };
       }
    });

    res.json({ data: { dlq_depth: queueInfo.messages, stats: queueInfo.message_stats ?? {}, messages } });
  } catch (err) { next(err); }
});

// ── POST /admin/queue/dlq/:messageId/retry (US-14) ────────────────────────
adminRouter.post('/queue/dlq/:messageId/retry', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const channel = await getChannel();
    const targetId = req.params['messageId'];
    let found = false;
    const messages = [];

    // Read messages synchronously until we find it
    while (true) {
      const msg = await channel.get(QUEUES.REPORTS_INBOUND_DLQ, { noAck: false });
      if (!msg) break;
      
      try {
        const env = JSON.parse(msg.content.toString());
        if (env.messageId === targetId) {
          found = true;
          env.retryCount = 0; // reset retry count
          channel.sendToQueue(QUEUES.REPORTS_INBOUND, Buffer.from(JSON.stringify(env)), { persistent: true });
          channel.ack(msg);
          
          await db.query(`INSERT INTO audit_log (actor_id, action, target_type, target_id) VALUES ($1, $2, $3, $4)`, 
             [(req as any).user.user_id, 'RETRY_DLQ_MSG', 'dlq', targetId]);
          break;
        } else {
          messages.push(msg);
        }
      } catch (e) {
         messages.push(msg);
      }
    }

    // Requeue the rest
    for (const msg of messages) {
      channel.nack(msg, false, true);
    }

    if (!found) throw new AppError(404, 'NOT_FOUND', 'Message not found in DLQ');
    res.json({ data: { success: true } });
  } catch (err) { next(err); }
});

// ── DELETE /admin/queue/dlq/:messageId (US-14) ────────────────────────────
adminRouter.delete('/queue/dlq/:messageId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const channel = await getChannel();
    const targetId = req.params['messageId'];
    let found = false;
    const messages = [];

    while (true) {
      const msg = await channel.get(QUEUES.REPORTS_INBOUND_DLQ, { noAck: false });
      if (!msg) break;
      
      try {
        const env = JSON.parse(msg.content.toString());
        if (env.messageId === targetId) {
          found = true;
          channel.ack(msg); // Just ack it to discard it
          await db.query(`INSERT INTO audit_log (actor_id, action, target_type, target_id) VALUES ($1, $2, $3, $4)`, 
             [(req as any).user.user_id, 'DISCARD_DLQ_MSG', 'dlq', targetId]);
          break;
        } else {
          messages.push(msg);
        }
      } catch (e) {
         // Should we discard unparseable ones? Let's just push them back unless instructed otherwise.
         messages.push(msg);
      }
    }

    for (const msg of messages) {
      channel.nack(msg, false, true);
    }

    if (!found) throw new AppError(404, 'NOT_FOUND', 'Message not found in DLQ');
    res.json({ data: { success: true } });
  } catch (err) { next(err); }
});

// ── GET /admin/audit — filterable audit log (US-15) ──────────────────────
adminRouter.get('/audit', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { action, actor_email, page = '1', per_page = '50' } = req.query as Record<string, string>;

    const conditions: string[] = ['1=1'];
    const params:     unknown[] = [];
    let p = 1;

    if (action) { conditions.push(`al.action = $${p++}`); params.push(action); }
    if (actor_email) {
      conditions.push(`u.email ILIKE $${p++}`); params.push(`%${actor_email}%`);
    }

    const pageNum  = Math.max(1, Number.parseInt(page, 10));
    const pageSize = Math.min(100, Number.parseInt(per_page, 10));
    const offset   = (pageNum - 1) * pageSize;

    const result = await db.query(
      `SELECT al.log_id, al.action, al.target_type, al.target_id,
              al.meta, al.ip_address, al.created_at,
              u.email AS actor_email
         FROM audit_log al
    LEFT JOIN users u ON u.user_id = al.actor_id
        WHERE ${conditions.join(' AND ')}
     ORDER BY al.created_at DESC
        LIMIT $${p++} OFFSET $${p++}`,
      [...params, pageSize, offset],
    );

    const countResult = await db.query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM audit_log al
  LEFT JOIN users u ON u.user_id = al.actor_id
       WHERE ${conditions.join(' AND ')}`,
      params,
    );

    res.json({
      data: result.rows,
      meta: { page: pageNum, per_page: pageSize, total: Number.parseInt(countResult.rows[0]?.total ?? '0', 10) },
    });
  } catch (err) { next(err); }
});

// ── GET /admin/audit.csv — export audit log (US-15 AC5) ──────────────────────
adminRouter.get('/audit.csv', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { action, actor_email } = req.query as Record<string, string>;

    const conditions: string[] = ['1=1'];
    const params:     unknown[] = [];
    let p = 1;

    if (action) { conditions.push(`al.action = $${p++}`); params.push(action); }
    if (actor_email) {
      conditions.push(`u.email ILIKE $${p++}`); params.push(`%${actor_email}%`);
    }

    // Set headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audit_log.csv"');
    
    // Write CSV header
    res.write('log_id,created_at,actor_email,action,target_type,target_id,ip_address\n');
    
    // For simplicity without Cursor (MVP), fetch top 50,000 max
    const result = await db.query(
      `SELECT al.log_id, al.action, al.target_type, al.target_id,
              al.ip_address, al.created_at,
              u.email AS actor_email
         FROM audit_log al
    LEFT JOIN users u ON u.user_id = al.actor_id
        WHERE ${conditions.join(' AND ')}
     ORDER BY al.created_at DESC
        LIMIT 50000`,
      params,
    );

    for (const record of result.rows) {
       const row = [
          record.log_id,
          (record.created_at as Date).toISOString(),
          record.actor_email || 'system',
          record.action,
          record.target_type || '',
          record.target_id || '',
          record.ip_address || '',
       ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
       res.write(row + '\n');
    }
    
    res.end();
  } catch (err) { next(err); }
});
