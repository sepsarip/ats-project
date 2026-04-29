import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';
import logger from '../config/logger.js';

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    logger.warn('Invalid or missing authorization header', {
      url: req.originalUrl,
      ip: req.ip,
    });
    return next(
      new HttpError(
        401,
        'Token tidak valid atau telah kadaluarsa',
        'INVALID_TOKEN',
      ),
    );
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    logger.warn('Invalid or expired token', {
      url: req.originalUrl,
      ip: req.ip,
      error: err && (err.message || err),
    });
    return next(
      new HttpError(
        401,
        'Token tidak valid atau telah kadaluarsa',
        'INVALID_TOKEN',
      ),
    );
  }
}

export function optionalAuthMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return next();
  }

  if (!auth.startsWith('Bearer ')) {
    return next(
      new HttpError(401, 'Token is invalid or expired', 'INVALID_TOKEN'),
    );
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    logger.warn('Invalid or expired token (optional)', {
      url: req.originalUrl,
      ip: req.ip,
      error: err && (err.message || err),
    });
    return next(
      new HttpError(401, 'Token is invalid or expired', 'INVALID_TOKEN'),
    );
  }
}
