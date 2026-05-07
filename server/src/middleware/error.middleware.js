import { env } from '../config/env.js';
import logger from '../config/logger.js';

export function notFoundHandler(req, res, next) {
  logger.warn('Resource not found', { url: req.originalUrl });
  res.status(404).json({ status: 'error', message: 'Resource not found' });
}

export function errorHandler(err, req, res, next) {
  const status = err && err.statusCode ? err.statusCode : 500;
  const code =
    err && err.code ? err.code : status === 500 ? 'INTERNAL_ERROR' : undefined;
  const isProd = env.nodeEnv === 'production';

  const message =
    isProd && status === 500
      ? 'Internal server error'
      : (err && err.message) || 'Error';

  if (status >= 500) {
    logger.error('Internal server error', {
      message: err?.message,
      stack: err?.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user?.id,
    });
  } else {
    logger.warn('Handled error', {
      status,
      code,
      message: err?.message,
      url: req.originalUrl,
    });
  }

  const payload = { status: 'error', message };
  if (code) payload.code = code;

  res.status(status).json(payload);
}
