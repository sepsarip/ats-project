import { HttpError } from '../utils/HttpError.js';

export function requireRole(required) {
  return function (req, res, next) {
    const userRole = req.user && req.user.role;
    if (!userRole) {
      return next(
        new HttpError(
          401,
          'Token tidak valid atau telah kadaluarsa',
          'INVALID_TOKEN',
        ),
      );
    }

    const allowed = Array.isArray(required) ? required : [required];
    if (!allowed.includes(userRole)) {
      return next(new HttpError(403, 'Akses ditolak', 'FORBIDDEN'));
    }

    return next();
  };
}
