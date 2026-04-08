import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findByEmail, createUser } from '../models/users.model.js';

export async function registerJobseeker({ fullName, email, password }) {
  const existing = await findByEmail(email);
  if (existing) {
    const err = new Error('email already registered');
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
      const e = new Error('email already registered');
      e.statusCode = 400;
      throw e;
    }
    throw err;
  }
}

export async function login({ email, password }) {
  const user = await findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
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
