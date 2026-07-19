import express from 'express';
import {
  register,
  login,
  changePassword,
  forgetPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgetPasswordValidation,
  resetPasswordValidation,
} from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post(
  '/change-password',
  authMiddleware,
  changePasswordValidation,
  validate,
  changePassword,
);
router.post('/forget-password', forgetPasswordValidation, validate, forgetPassword);
router.post(
  '/reset-password/:token',
  resetPasswordValidation,
  validate,
  resetPassword,
);


export default router;

