import morgan from 'morgan';
import { logger } from '../config/logger';
import { type StreamOptions } from 'morgan';

const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

export const requestLogger = morgan('combined', { stream });
