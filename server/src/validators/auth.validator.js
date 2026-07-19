import { body, param } from 'express-validator';

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
    .withMessage('New password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('confirmPassword does not match'),
  body('newPassword')
    .custom((value, { req }) => value !== req.body.oldPassword)
    .withMessage('New password must not be the same as old password'),
];

export const forgetPasswordValidation = [
  body('email').isEmail().withMessage('email is invalid').normalizeEmail(),
];

export const resetPasswordValidation = [
  param('token').notEmpty().withMessage('token is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('confirmPassword does not match'),
];
