import { param } from 'express-validator';

export const applyValidation = [
  param('jobId')
    .isInt({ min: 1 })
    .withMessage('jobId must be a positive integer')
    .toInt(),
];
