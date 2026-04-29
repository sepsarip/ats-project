import morgan from 'morgan';
import { env } from './env.js';
import logger from '../config/logger.js';

const morganMiddleware = morgan('combined', {
  stream: {
    write: (message) => {
      logger.info(message.trim(), { type: 'http' });
    },
  },
});

export default morganMiddleware;
