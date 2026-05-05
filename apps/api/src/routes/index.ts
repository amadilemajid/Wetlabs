import { Router } from 'express';
import { authRouter }    from './auth.routes';
import { reportRouter }  from './report.routes';
import { wetlandRouter } from './wetland.routes';
import { ussdRouter    } from './ussd.routes';
import { exportRouter }  from './export.routes';
import { smsRouter }     from './sms.routes';
import { adminRouter }   from './admin.routes';
import { healthRouter }  from './health.routes';
import { profileRouter } from './profile.routes';

export const apiRouter = Router();

apiRouter.use('/health',   healthRouter);
apiRouter.use('/auth',     authRouter);
apiRouter.use('/reports',  reportRouter);
apiRouter.use('/wetlands', wetlandRouter);
apiRouter.use('/ussd',     ussdRouter);
apiRouter.use('/sms',      smsRouter);
apiRouter.use('/export',   exportRouter);
apiRouter.use('/admin',    adminRouter);
apiRouter.use('/profile',  profileRouter);
