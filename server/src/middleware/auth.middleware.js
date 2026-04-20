import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
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
    return next(
      new HttpError(
        401,
        'Token tidak valid atau telah kadaluarsa',
        'INVALID_TOKEN',
      ),
    );
  }
}
