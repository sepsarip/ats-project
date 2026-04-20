import { body } from 'express-validator';

export const registerValidation = [
  body('fullName').trim().notEmpty().withMessage('fullName is required'),
  body('email').isEmail().withMessage('email is invalid').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('email is invalid').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
];

export const changePasswordValidation = [
  body('oldPassword').notEmpty().withMessage('oldPassword is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password baru minimal 6 karakter'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('confirmPassword tidak cocok'),
  body('newPassword')
    .custom((value, { req }) => value !== req.body.oldPassword)
    .withMessage('Password baru tidak boleh sama dengan password lama'),
];
