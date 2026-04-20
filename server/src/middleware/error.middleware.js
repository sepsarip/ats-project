import { env } from '../config/env.js';

export function notFoundHandler(req, res, next) {
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

  if (status >= 500) console.error(err && (err.stack || err));

  const payload = { status: 'error', message };
  if (code) payload.code = code;

  res.status(status).json(payload);
}
