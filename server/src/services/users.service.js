import bcrypt from 'bcryptjs';
import { HttpError } from '../utils/HttpError.js';
import { findByEmail, createUser } from '../models/users.model.js';
import logger from '../config/logger.js';

export async function createHrUser({ fullName, email, password }) {
  const existing = await findByEmail(email);
  if (existing) {
    throw new HttpError(400, 'Email sudah terdaftar', 'EMAIL_EXISTS');
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    const row = await createUser({
      full_name: fullName,
      email,
      password: hashed,
      role: 'hr',
    });
    logger.info('HR user created successfully', {
      userId: row.id,
      fullName: row.full_name,
    });

    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role || 'hr',
      isActive: row.is_active,
      createdAt: row.created_at,
    };
  } catch (err) {
    logger.error('Error creating HR user', { error: err.message });
    if (err && err.code === '23505') {
      throw new HttpError(400, 'Email sudah terdaftar', 'EMAIL_EXISTS');
    }
    throw err;
  }
}
