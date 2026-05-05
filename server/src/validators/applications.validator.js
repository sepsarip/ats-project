import { param, query } from 'express-validator';

export const applyValidation = [
  param('jobId')
    .isInt({ min: 1 })
    .withMessage('jobId must be a positive integer')
    .toInt(),
];

export const myApplicationsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be an integer >= 1')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50')
    .toInt(),
];

export const candidatesValidation = [
  param('jobId')
    .isInt({ min: 1 })
    .withMessage('jobId must be a positive integer')
    .toInt(),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be an integer >= 1')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit must be between 1 and 50')
    .toInt(),
  query('status')
    .optional()
    .isIn(['applied', 'rejected', 'interview', 'offered', 'hired'])
    .withMessage('status is invalid'),
];
