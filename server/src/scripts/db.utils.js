import { env } from '../config/env.js';
import { pool } from '../config/db.js';

export function assertDevOnly() {
  if (env.nodeEnv !== 'development') {
    throw new Error('This script can only be run in development environment');
  }
}

export async function closePool() {
  await pool.end();
}

export async function truncateAllTables() {
  const { rows } = await pool.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename != 'pgmigrations'
      AND tablename NOT LIKE 'pg_%'
      AND tablename NOT LIKE 'sql_%'
  `);

  if (rows.length === 0) {
    console.log('There are no tables to truncate.');
    return;
  }

  const tables = rows.map((r) => `"${r.tablename}"`).join(', ');

  console.log(`Truncating ${rows.length} tables...`);
  console.log(`Tables to truncate:`);
  rows.forEach((r, i) => {
    console.log(`${i + 1}. ${r.tablename}`);
  });

  await pool.query('BEGIN');
  try {
    await pool.query(`
      TRUNCATE TABLE ${tables}
      RESTART IDENTITY CASCADE
    `);
    await pool.query('COMMIT');
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
}
