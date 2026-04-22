import { HttpError } from '../utils/HttpError.js';

export function requireRole(role) {
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
    if (userRole !== role) {
      return next(
        new HttpError(
          403,
          'Akses ditolak: Hanya admin yang dapat membuat akun HR',
          'FORBIDDEN',
        ),
      );
    }
    return next();
  };
}
