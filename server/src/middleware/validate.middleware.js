import { validationResult } from 'express-validator';
import { HttpError } from '../utils/HttpError.js';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    const err = new HttpError(
      400,
      first.msg || 'Validation error',
      'VALIDATION_ERROR',
    );
    err.details = errors.array();
    return next(err);
  }
  next();
}
