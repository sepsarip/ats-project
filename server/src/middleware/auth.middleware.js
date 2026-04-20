import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Token is not provided or invalid format',
    });
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({
      status: 'error',
      message: 'Token is not valid or has expired',
    });
  }
}
