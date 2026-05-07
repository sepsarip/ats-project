import express from 'express';
import {
  register,
  login,
  changePassword,
} from '../controllers/auth.controller.js';
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
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

export default router;
