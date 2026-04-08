import { pool } from '../config/db.js';

export async function findByEmail(email) {
  const q = `SELECT * FROM users WHERE email = $1 LIMIT 1`;
  const { rows } = await pool.query(q, [email]);
  return rows[0] || null;
}

export async function createUser({
  full_name,
  email,
  password,
  role = 'jobseeker',
}) {
  const q = `INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, created_at`;
  const values = [full_name, email, password, role];
  const { rows } = await pool.query(q, values);
  return rows[0];
}
