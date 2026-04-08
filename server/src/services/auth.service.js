import bcrypt from 'bcryptjs';
import { findByEmail, createUser } from '../models/users.model.js';

export async function registerJobseeker({ fullName, email, password }) {
  const existing = await findByEmail(email);
  if (existing) {
    const err = new Error('email sudah terdaftar');
    err.statusCode = 400;
    throw err;
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
    // Handle unique constraint violation for email from PostgreSQL (error code 23505)
    if (err.code === '23505') {
      const e = new Error('email sudah terdaftar');
      e.statusCode = 400;
      throw e;
    }
    throw err;
  }
}
