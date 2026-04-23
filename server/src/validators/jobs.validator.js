import { body } from 'express-validator';

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
