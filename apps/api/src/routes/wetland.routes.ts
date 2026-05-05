import { Router, type Request, type Response, type NextFunction } from 'express';
import { getAllWetlands, getWetlandSummary } from '../services/wetland.service';
import { authenticate, authorise } from '../middleware/authenticate';
import { rateLimiter } from '../middleware/rateLimiter';

export const wetlandRouter = Router();

// GET /wetlands — public endpoint, cached (SRS 4.3)
wetlandRouter.get(
  '/',
  rateLimiter({ windowMs: 60_000, max: 200, keyPrefix: 'rl:wetlands' }),
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await getAllWetlands();
      res.json(data);
    } catch (err) { next(err); }
  },
);

// GET /wetlands/:code/summary — auth required (SRS 4.3, US-09, US-11)
wetlandRouter.get(
  '/:code/summary',
  authenticate,
  authorise('WETLAND_OFFICER', 'RESEARCHER', 'NGO_PARTNER', 'SYSTEM_ADMIN'),
  rateLimiter({ windowMs: 60_000, max: 100, keyPrefix: 'rl:wetland-summary' }),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = req.query as { from?: string; to?: string };
      const code = Array.isArray(req.params['code']) ? req.params['code'][0]! : req.params['code']!;
      const data = await getWetlandSummary(code, from, to);
      res.json({ data });
    } catch (err) { next(err); }
  },
);
