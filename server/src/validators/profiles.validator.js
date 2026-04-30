import { body } from 'express-validator';

export const updateProfileValidation = [
  body('fullName')
    .trim()
    .isString()
    .notEmpty()
    .withMessage('fullName must be a non-empty string'),
  body('phone')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('phone must be a string'),
  body('city')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('city must be a string'),
  body('province')
    .trim()
    .notEmpty()
    .isString()
    .withMessage('province must be a string'),
  body('bio')
    .trim()
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage(
      'bio must be a string with a maximum length of 500 characters',
    ),
  body('linkedin_url')
    .trim()
    .notEmpty()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('linkedin_url must be a valid URL with http or https'),
  body('portfolio_url')
    .trim()
    .notEmpty()
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('portfolio_url must be a valid URL with http or https'),
  body('birth_date')
    .trim()
    .notEmpty()
    .isDate({ format: 'YYYY-MM-DD' })
    .withMessage('birth_date must be a valid date (YYYY-MM-DD)'),
  body('gender')
    .trim()
    .notEmpty()
    .isIn(['male', 'female'])
    .withMessage('gender must be male or female'),
];

export default updateProfileValidation;
