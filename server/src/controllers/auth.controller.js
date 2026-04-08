import * as authService from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;
    const data = await authService.registerJobseeker({
      fullName,
      email,
      password,
    });
    res.status(201).json({
      status: 'success',
      message: 'register successfully',
      data,
    });
  } catch (err) {
    // If service threw custom error with message 'email sudah terdaftar', normalize response
    if (err.message === 'email sudah terdaftar') {
      return res.status(400).json({
        status: 'error',
        message: 'email sudah terdaftar',
      });
    }
    next(err);
  }
}
