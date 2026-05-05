import { Router, type Request, type Response, type NextFunction } from 'express';
import { validateHmac }        from '../middleware/validateHmac';
import { processUssdInput, type UssdSession } from '../adapters/ussd.statemachine';
import { redis }               from '../config/redis';
import { getChannel, QUEUES }  from '../config/queue';
import { logger }              from '../config/logger';
import { v4 as uuidv4 }        from 'uuid';
import type { WetlandReportDTO, QueueMessage } from '@wetlabs/shared-types';

export const ussdRouter = Router();

const SESSION_TTL = 180; // seconds — AT maximum session duration

ussdRouter.post('/callback',
  validateHmac,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId, phoneNumber, text } = req.body as {
        sessionId: string; phoneNumber: string; text: string;
      };

      const sessionKey = `ussd:session:${sessionId}`;
      const stored     = await redis.get(sessionKey);
      let session: UssdSession = stored
        ? (JSON.parse(stored) as UssdSession)
        : { step: 0, phone_number: phoneNumber };

      // Extract the latest user input (last element after splitting on '*')
      const inputs    = (text ?? '').split('*');
      const userInput = inputs[inputs.length - 1] ?? '';

      const response = processUssdInput(session, userInput);

      if (response.isEnd && response.nextSession.step === 4) {
        // Enqueue the completed report (FR-05 timing starts here)
        const dto: WetlandReportDTO = {
          reporter_msisdn:  phoneNumber,
          wetland_code:     response.nextSession.wetland_code!,
          observation_type: response.nextSession.observation_type!,
          severity:         response.nextSession.severity!,
          channel:          'USSD',
          ussd_session_id:  sessionId,
          raw_payload:      req.body as Record<string, unknown>,
        };
        const msg: QueueMessage<WetlandReportDTO> = {
          messageId: uuidv4(), timestamp: new Date().toISOString(), retryCount: 0, payload: dto,
        };
        const ch = await getChannel();
        ch.sendToQueue(QUEUES.REPORTS_INBOUND, Buffer.from(JSON.stringify(msg)), {
          persistent: true, contentType: 'application/json',
        });
        logger.info('USSD report enqueued', { sessionId, wetland_code: dto.wetland_code });
        await redis.del(sessionKey);
      } else if (!response.isEnd) {
        await redis.setex(sessionKey, SESSION_TTL, JSON.stringify(response.nextSession));
      }

      res.setHeader('Content-Type', 'text/plain');
      res.send(response.text);
    } catch (err) { next(err); }
  },
);
