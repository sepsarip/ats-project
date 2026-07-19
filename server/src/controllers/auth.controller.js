import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../config/logger.js';

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  logger.info('Register request received', { fullName });
  const data = await authService.registerJobseeker({
    fullName,
    email,
    password,
  });

  logger.info('User registered successfully', { fullName });
  res.status(201).json({
    status: 'success',
    message: 'register successfully',
    data,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await authService.login({ email, password });

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  const { oldPassword, newPassword } = req.body;
  logger.info('Change password request received', { userId });
  const data = await authService.changePassword({
    userId,
    oldPassword,
    newPassword,
  });

  logger.info('Password changed successfully', { userId });
  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully.',
    data,
  });
});

export const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  logger.info('Forget password request received', { email });
  const data = await authService.requestForgotPassword(email);

  res.status(200).json({
    status: 'success',
    message: data.message
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  logger.info('Reset password request received');
  const data = await authService.resetPassword({ token, newPassword });

  res.status(200).json({
    status: 'success',
    message: data.message,
    data,
  });
});


