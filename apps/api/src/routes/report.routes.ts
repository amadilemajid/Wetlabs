import { Router } from 'express';
import { authenticate, authorise } from '../middleware/authenticate';
import { rateLimiter }    from '../middleware/rateLimiter';
import { ingestReport, queryReports } from '../services/report.service';
import { db } from '../config/db';
import Joi    from 'joi';
import { AppError } from '../middleware/errorHandler';
import type { ReportFilters } from '@wetlabs/shared-types';
import type { Request, Response, NextFunction } from 'express';

export const reportRouter = Router();

// POST /reports/ingest — internal only (X-Internal-Key)
reportRouter.post('/ingest',
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers['x-internal-key'] !== process.env['INTERNAL_API_KEY']) {
      next(new AppError(401, 'UNAUTHORISED', 'Invalid internal API key'));
      return;
    }
    next();
  },
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await ingestReport(req.body);
      res.status(201).json({ data: result });
    } catch (err) { next(err); }
  },
);

// GET /reports — authenticated, role-based
const reportQuerySchema = Joi.object({
  wetland_code:     Joi.string().alphanum().max(20),
  from:             Joi.string().isoDate(),
  to:               Joi.string().isoDate(),
  severity:         Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  observation_type: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  channel:          Joi.string(),
  bbox:             Joi.string().pattern(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/),
  page:             Joi.number().integer().min(1).default(1),
  per_page:         Joi.number().integer().min(1).max(500).default(100),
});

reportRouter.get('/',
  authenticate,
  authorise('WETLAND_OFFICER', 'RESEARCHER', 'SYSTEM_ADMIN'),
  rateLimiter({ windowMs: 60_000, max: 100, keyPrefix: 'rl:reports' }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = reportQuerySchema.validate(req.query, { abortEarly: false });
      if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }
      const filters: ReportFilters = {
        ...value,
        severity:         value.severity         ? [value.severity].flat()         : undefined,
        observation_type: value.observation_type ? [value.observation_type].flat() : undefined,
        bbox:             value.bbox ? value.bbox.split(',').map(Number) : undefined,
      };
      const data = await queryReports(filters);
      res.json(data);
    } catch (err) { next(err); }
  },
);

// GET /reports/public — public map endpoint (no auth required)
reportRouter.get('/public/map',
  rateLimiter({ windowMs: 60_000, max: 100, keyPrefix: 'rl:reports-public' }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = reportQuerySchema.validate(req.query, { abortEarly: false });
      if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }
      const filters: ReportFilters = {
        ...value,
        severity:         value.severity         ? [value.severity].flat()         : undefined,
        observation_type: value.observation_type ? [value.observation_type].flat() : undefined,
        bbox:             value.bbox ? value.bbox.split(',').map(Number) : undefined,
      };
      const data = await queryReports(filters);
      res.json(data);
    } catch (err) { next(err); }
  },
);

// PATCH /reports/:id/flag
reportRouter.patch('/:id/flag',
  authenticate,
  authorise('WETLAND_OFFICER', 'SYSTEM_ADMIN'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { error, value } = Joi.object({
        flag_reason: Joi.string().max(300).required(),
      }).validate(req.body);
      if (error) { next(new AppError(400, 'VALIDATION_ERROR', error.message)); return; }
      await db.query(
        'UPDATE wetland_reports SET is_flagged = TRUE, flag_reason = $1 WHERE report_id = $2',
        [value.flag_reason, req.params['id']],
      );
      res.status(200).json({ data: { updated: true } });
    } catch (err) { next(err); }
  },
);

// PATCH /reports/:id/resolve (US-08 AC)
reportRouter.patch('/:id/resolve',
  authenticate,
  authorise('WETLAND_OFFICER', 'SYSTEM_ADMIN'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await db.query(
        'UPDATE wetland_reports SET is_resolved = TRUE, resolved_at = NOW() WHERE report_id = $1',
        [req.params['id']],
      );
      res.status(200).json({ data: { resolved: true } });
    } catch (err) { next(err); }
  },
);

// PATCH /reports/:id/duplicate (Toggle)
reportRouter.patch('/:id/duplicate',
  authenticate,
  authorise('WETLAND_OFFICER', 'SYSTEM_ADMIN'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await db.query(
        'UPDATE wetland_reports SET is_duplicate = NOT is_duplicate WHERE report_id = $1',
        [req.params['id']],
      );
      res.status(200).json({ data: { updated: true } });
    } catch (err) { next(err); }
  },
);
