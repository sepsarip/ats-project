import bcrypt from 'bcryptjs';
import { findByEmail, createUser } from '../models/users.model.js';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

async function seedAdmin() {
  const fullName = env.admin.fullName;
  const email = env.admin.email;
  const password = env.admin.password;

  if (!fullName || !email || !password) {
    console.error(
      'ADMIN_FULL_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD environment variables must be set',
    );
    process.exit(1);
  }

  try {
    const existing = await findByEmail(email);
    if (existing) {
      console.error('Email sudah terdaftar untuk admin:', email);
      process.exit(1);
    }

    const hashed = await bcrypt.hash(password, 10);
    const row = await createUser({
      full_name: fullName,
      email,
      password: hashed,
      role: 'admin',
    });

    console.log('Admin created:');
    console.log({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      role: row.role,
      status: row.is_active,
      createdAt: row.created_at,
    });
  } catch (err) {
    console.error(
      'Error creating admin:',
      err && err.message ? err.message : err,
    );
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedAdmin();
