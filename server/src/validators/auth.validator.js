import { body } from 'express-validator';

export const registerValidation = [
  body('fullName').trim().notEmpty().withMessage('fullName is required'),
  body('email').isEmail().withMessage('email is invalid').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
];
