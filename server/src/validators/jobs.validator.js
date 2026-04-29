import { body, query, param } from 'express-validator';

export const createJobValidation = [
  body('title').isString().trim().notEmpty().withMessage('title is required'),
  body('about').isString().trim().notEmpty().withMessage('about is required'),

  body('descriptions')
    .isArray({ min: 1 })
    .withMessage('descriptions must be an array with at least 1 item'),
  body('descriptions.*').isString().trim().notEmpty(),

  body('requirements')
    .isArray({ min: 1 })
    .withMessage('requirements must be an array with at least 1 item'),
  body('requirements.*').isString().trim().notEmpty(),

  body('additional_info').optional().isArray(),
  body('additional_info.*').optional().isString().trim().notEmpty(),

  body('employment_type')
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('employment_type is invalid'),
  body('location')
    .isIn(['onsite', 'remote', 'hybrid'])
    .withMessage('location is invalid'),

  body('min_salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('min_salary must be a number')
    .toFloat(),
  body('max_salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('max_salary must be a number')
    .toFloat(),

  // cross-field salary validation
  body().custom((_, { req }) => {
    const min = req.body.min_salary;
    const max = req.body.max_salary;
    if (min != null && max != null && Number(min) > Number(max)) {
      throw new Error('min_salary must be less than or equal to max_salary');
    }
    return true;
  }),
];

export const listJobsValidation = [
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
  query('location')
    .optional()
    .isIn(['onsite', 'remote', 'hybrid'])
    .withMessage('location is invalid'),
  query('employment_type')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('employment_type is invalid'),
  query('search').optional().isString().trim(),
  query('status')
    .optional()
    .isIn(['draft', 'open', 'closed'])
    .withMessage('status is invalid'),
];

export const getJobValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive integer')
    .toInt(),
];

export const updateJobValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('id must be a positive integer')
    .toInt(),

  body('title').isString().trim().notEmpty().withMessage('title is required'),
  body('about').isString().trim().notEmpty().withMessage('about is required'),

  body('descriptions')
    .isArray({ min: 1 })
    .withMessage('descriptions must be an array with at least 1 item'),
  body('descriptions.*').isString().trim().notEmpty(),

  body('requirements')
    .isArray({ min: 1 })
    .withMessage('requirements must be an array with at least 1 item'),
  body('requirements.*').isString().trim().notEmpty(),

  body('additional_info').optional().isArray(),
  body('additional_info.*').optional().isString().trim().notEmpty(),

  body('employment_type')
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('employment_type is invalid'),
  body('location')
    .isIn(['onsite', 'remote', 'hybrid'])
    .withMessage('location is invalid'),

  body('min_salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('min_salary must be a number')
    .toFloat(),
  body('max_salary')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('max_salary must be a number')
    .toFloat(),

  body('status')
    .isIn(['draft', 'open', 'closed'])
    .withMessage('status is invalid'),

  // cross-field salary validation: if one provided, both required, and min<=max
  body().custom((_, { req }) => {
    const hasMin = req.body.min_salary != null;
    const hasMax = req.body.max_salary != null;
    if ((hasMin && !hasMax) || (!hasMin && hasMax)) {
      throw new Error(
        'Both min_salary and max_salary must be provided together',
      );
    }
    if (
      hasMin &&
      hasMax &&
      Number(req.body.min_salary) > Number(req.body.max_salary)
    ) {
      throw new Error('min_salary must be less than or equal to max_salary');
    }
    return true;
  }),
];
