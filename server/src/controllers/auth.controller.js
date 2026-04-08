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
    // If service threw custom error with message 'email already registered', normalize response
    if (err.message === 'email already registered') {
      return res.status(400).json({
        status: 'error',
        message: 'email already registered',
      });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data,
    });
  } catch (err) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }
    next(err);
  }
}
