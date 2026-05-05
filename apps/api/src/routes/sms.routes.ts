import { Router, type Request, type Response, type NextFunction } from 'express';
import { validateHmac } from '../middleware/validateHmac';
import { parseSmsReport } from '../adapters/sms.parser';
import { getChannel, QUEUES } from '../config/queue';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';
import type { WetlandReportDTO, QueueMessage } from '@wetlabs/shared-types';

export const smsRouter = Router();

/**
 * Handles Africa's Talking SMS callback (SRS US-03)
 */
smsRouter.post('/callback',
  validateHmac,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, text } = req.body as { from: string; text: string };

      if (!from || !text) {
        res.status(400).json({ error: 'MISSING_PARAMS' });
        return;
      }

      const parsed = parseSmsReport(text, from);
      const ch     = await getChannel();

      if (!parsed.success) {
        // Send correction SMS back to user (FR-05 timing applies)
        const correctionMsg = {
          messageId: uuidv4(),
          timestamp: new Date().toISOString(),
          retryCount: 0,
          payload: {
            msisdn:  from,
            type:    'ALERT',
            message: parsed.error,
          },
        };
        ch.sendToQueue(QUEUES.NOTIFICATIONS_OUTBOUND, Buffer.from(JSON.stringify(correctionMsg)), {
          persistent: true,
          contentType: 'application/json',
        });
        
        logger.info('Invalid SMS format received, correction enqueued', { from, text });
        res.status(200).json({ status: 'CORRECTION_SENT' });
        return;
      }

      // Valid report parsed
      const dto = parsed.data as WetlandReportDTO;
      const msg: QueueMessage<WetlandReportDTO> = {
        messageId:  uuidv4(),
        timestamp:  new Date().toISOString(),
        retryCount: 0,
        payload:    dto,
      };

      ch.sendToQueue(QUEUES.REPORTS_INBOUND, Buffer.from(JSON.stringify(msg)), {
        persistent: true,
        contentType: 'application/json',
      });

      logger.info('SMS report enqueued', { from, wetland_code: dto.wetland_code });
      res.status(200).json({ status: 'REPORT_ENQUEUED' });

    } catch (err) { next(err); }
  },
);
