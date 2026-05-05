import { pool } from '../config/db.js';

export async function insertApplication(
  client,
  { job_id, user_id, cv_file_id },
) {
  const q = `
    INSERT INTO applications (job_id, user_id, cv_file_id)
    VALUES ($1, $2, $3)
    RETURNING id, job_id, user_id, cv_file_id, status, applied_at
  `;
  const values = [job_id, user_id, cv_file_id];
  const { rows } = await client.query(q, values);
  return rows[0] || null;
}

export async function getApplicationByUserIdAndJobId(client, userId, jobId) {
  const q = `
    SELECT id, job_id, user_id, cv_file_id, status, applied_at
    FROM applications
    WHERE user_id = $1 AND job_id = $2
  `;
  const values = [userId, jobId];
  const { rows } = await client.query(q, values);
  return rows[0] || null;
}

export async function countApplicationsByUser(userId) {
  const q = `
    SELECT COUNT(*)::int AS total
    FROM applications a
    WHERE a.user_id = $1
  `;
  const { rows } = await pool.query(q, [userId]);
  return rows[0]?.total ?? 0;
}

export async function listApplicationsByUser(
  userId,
  options = { limit: 10, offset: 0 },
) {
  const q = `
    SELECT
      a.id,
      a.status,
      a.score,
      a.applied_at,
      a.updated_at,
      j.id AS job_id,
      j.title AS job_title,
      j.employment_type AS job_employment_type,
      j.location AS job_location,
      j.min_salary AS job_min_salary,
      j.max_salary AS job_max_salary,
      j.status AS job_status
    FROM applications a
    LEFT JOIN ats_jobs j ON a.job_id = j.id
    WHERE a.user_id = $1
    ORDER BY a.applied_at DESC
    LIMIT $2 OFFSET $3
  `;
  const values = [userId, options.limit, options.offset];
  const { rows } = await pool.query(q, values);
  return rows;
}
