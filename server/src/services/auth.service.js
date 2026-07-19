import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';
import {
  findByEmail,
  createUser,
  findById,
  updatePasswordById,
} from '../models/users.model.js';
import logger from '../config/logger.js';
import { sendResetPasswordEmail } from '../utils/mailer.js';

export async function registerJobseeker({ fullName, email, password }) {
  const existing = await findByEmail(email);
  if (existing) {
    throw new HttpError(400, 'email already registered', 'EMAIL_EXISTS');
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    const row = await createUser({
      full_name: fullName,
      email,
      password: hashed,
      role: 'jobseeker',
    });
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      created_at: row.created_at,
    };
  } catch (err) {
    logger.error('Error registering user', { error: err.message });
    // Handle unique constraint violation for email from PostgreSQL (error code 23505)
    if (err.code === '23505') {
      throw new HttpError(400, 'email already registered', 'EMAIL_EXISTS');
    }
    throw err;
  }
}

export async function login({ email, password }) {
  const user = await findByEmail(email);
  if (!user) {
    throw new HttpError(
      401,
      'Invalid email or password',
      'INVALID_CREDENTIALS',
    );
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new HttpError(
      401,
      'Invalid email or password',
      'INVALID_CREDENTIALS',
    );
  }

  const payload = {
    id: user.id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  return {
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
    },
    token: {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: env.jwt.expiresIn,
    },
  };
}

export async function changePassword({ userId, oldPassword, newPassword }) {
  const user = await findById(userId);
  if (!user) {
    throw new HttpError(404, 'User tidak ditemukan', 'USER_NOT_FOUND');
  }
  logger.info('Change password request processed', { userId });

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) {
    throw new HttpError(401, 'Password lama tidak sesuai', 'INVALID_PASSWORD');
  }

  if (oldPassword === newPassword) {
    throw new HttpError(
      400,
      'Password baru tidak boleh sama dengan password lama',
      'SAME_PASSWORD',
    );
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  const updated = await updatePasswordById(userId, hashed);
  if (!updated) {
    throw new HttpError(404, 'User tidak ditemukan', 'USER_NOT_FOUND');
  }

  return {
    id: updated.id,
    email: updated.email,
    fullName: updated.full_name,
    updatedAt: updated.updated_at,
  };
}

export async function requestForgotPassword(email) {
  const user = await findByEmail(email);
  if (!user) {
    return {
      message:
        'If email is registered, password reset instructions have been sent to that email.',
    };
  }

  const resetSecret = env.jwt.secret + user.password;
  const token = jwt.sign(
    { id: user.id, email: user.email, purpose: 'reset_password' },
    resetSecret,
    { expiresIn: '15m' },
  );

  const resetUrl = `${env.frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

  try {
    await sendResetPasswordEmail({ to: user.email, resetUrl });
    return {
      message: `If email is registered, password reset instructions have been sent, please check your inbox and spam folder.`
    };

  } catch (err) {
    logger.error('Failed to send reset password email', {
      error: err.message,
      email: user.email,
    });
    throw new HttpError(
      500,
      'Failed to send reset password email',
      'EMAIL_SEND_FAILED',
    );
  }
}

export async function resetPassword({ token, newPassword }) {
  let decoded;
  try {
    decoded = jwt.decode(token);
  } catch {
    throw new HttpError(
      400,
      'The password reset token is invalid or has expired',
      'INVALID_RESET_TOKEN',
    );
  }

  if (!decoded || decoded.purpose !== 'reset_password' || !decoded.id) {
    throw new HttpError(
      400,
      'The password reset token is invalid or has expired',
      'INVALID_RESET_TOKEN',
    );
  }

  const user = await findById(decoded.id);
  if (!user) {
    throw new HttpError(
      400,
      'The password reset token is invalid or has expired',
      'INVALID_RESET_TOKEN',
    );
  }

  const resetSecret = env.jwt.secret + user.password;
  try {
    jwt.verify(token, resetSecret);
    logger.info('Reset password token verified successfully');
  } catch {
    throw new HttpError(
      400,
      'The password reset token is invalid or has expired',
      'INVALID_RESET_TOKEN',
    );
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  const updated = await updatePasswordById(user.id, hashed);
  if (!updated) {
    throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');
  }

  return {
    id: updated.id,
    email: updated.email,
    message: 'Password has been successfully updated.',
  };
}

