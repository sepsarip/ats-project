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

export async function countApplicationsByJob(jobId, filters = {}) {
  const { status, gender, city, province } = filters;
  const conditions = [];
  const values = [];
  let idx = 1;
  conditions.push(`a.job_id = $${idx++}`);
  values.push(jobId);
  if (status) {
    conditions.push(`a.status = $${idx++}`);
    values.push(status);
  }
  if (gender) {
    conditions.push(`p.gender = $${idx++}`);
    values.push(gender);
  }
  if (city) {
    conditions.push(`p.city ILIKE $${idx++}`);
    values.push(`${city}%`);
  }
  if (province) {
    conditions.push(`p.province ILIKE $${idx++}`);
    values.push(`${province}%`);
  }

  const q = `
    SELECT COUNT(*)::int AS total
    FROM applications a
    LEFT JOIN profiles p ON a.user_id = p.user_id
    WHERE ${conditions.join(' AND ')}
  `;

  const { rows } = await pool.query(q, values);
  return rows[0]?.total ?? 0;
}

export async function listCandidatesByJob(
  jobId,
  filters = {},
  options = { limit: 10, offset: 0 },
) {
  const { status, gender, city, province } = filters;
  const conditions = [];
  const values = [];
  let idx = 1;
  conditions.push(`a.job_id = $${idx++}`);
  values.push(jobId);
  if (status) {
    conditions.push(`a.status = $${idx++}`);
    values.push(status);
  }
  if (gender) {
    conditions.push(`p.gender = $${idx++}`);
    values.push(gender);
  }
  if (city) {
    conditions.push(`p.city ILIKE $${idx++}`);
    values.push(`${city}%`);
  }
  if (province) {
    conditions.push(`p.province ILIKE $${idx++}`);
    values.push(`${province}%`);
  }

  const q = `
    SELECT
      a.id AS application_id,
      a.status,
      a.score,
      a.applied_at,
      u.id AS user_id,
      u.full_name,
      u.email,
      p.city,
      p.province,
      p.gender
    FROM applications a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY a.applied_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;

  values.push(options.limit);
  values.push(options.offset);

  const { rows } = await pool.query(q, values);
  return rows;
}

export async function getApplicationWithCandidateDetail(jobId, userId) {
  const q = `
    SELECT
      a.id AS application_id,
      a.status AS application_status,
      a.score AS application_score,
      a.applied_at AS application_applied_at,
      j.id AS job_id,
      j.title AS job_title,
      j.status AS job_status,
      u.id AS user_id,
      u.full_name AS user_full_name,
      u.email AS user_email,
      p.phone AS profile_phone,
      p.city AS profile_city,
      p.province AS profile_province,
      p.gender AS profile_gender,
      p.bio AS profile_bio,
      p.linkedin_url AS profile_linkedin_url,
      p.portfolio_url AS profile_portfolio_url,
      p.birth_date AS profile_birth_date,
      cv.file_name AS cv_file_name,
      cv.mime_type AS cv_mime_type,
      cv.file_path AS cv_file_path,
      cv.uploaded_at AS cv_uploaded_at
    FROM applications a
    LEFT JOIN ats_jobs j ON a.job_id = j.id
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN profiles p ON u.id = p.user_id
    LEFT JOIN cv_files cv ON a.cv_file_id = cv.id
    WHERE a.job_id = $1 AND a.user_id = $2
    LIMIT 1
  `;
  const values = [jobId, userId];
  const { rows } = await pool.query(q, values);
  return rows[0] || null;
}
