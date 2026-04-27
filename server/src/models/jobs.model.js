import { pool } from '../config/db.js';

export async function insertJob(fields) {
  const q = `INSERT INTO ats_jobs (posted_by, title, about, requirements, descriptions, additional_info, employment_type, location, min_salary, max_salary)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING id, title, employment_type, location, status, created_at`;

  const values = [
    fields.posted_by,
    fields.title,
    fields.about,
    JSON.stringify(fields.requirements || []),
    JSON.stringify(fields.descriptions || []),
    JSON.stringify(fields.additional_info || []),
    fields.employment_type,
    fields.location,
    fields.min_salary,
    fields.max_salary,
  ];

  const { rows } = await pool.query(q, values);
  return rows[0];
}

export async function listJobs(
  filters = {},
  options = { limit: 10, offset: 0 },
) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (filters.status) {
    conditions.push(`j.status = $${idx++}`);
    values.push(filters.status);
  }
  if (filters.location) {
    conditions.push(`j.location = $${idx++}`);
    values.push(filters.location);
  }
  if (filters.employment_type) {
    conditions.push(`j.employment_type = $${idx++}`);
    values.push(filters.employment_type);
  }
  if (filters.search) {
    conditions.push(`j.title ILIKE $${idx++}`);
    values.push(`%${filters.search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const q = `
  SELECT
    j.id, 
    j.title, 
    j.about, 
    j.employment_type, 
    j.location, 
    j.min_salary, 
    j.max_salary, 
    j.status, 
    j.created_at, 
    u.full_name AS posted_by_name
  FROM ats_jobs j
  LEFT JOIN users u ON j.posted_by = u.id
  ${where}
  ORDER BY j.created_at DESC
  LIMIT $${idx} OFFSET $${idx + 1}
  `;

  values.push(options.limit);
  values.push(options.offset);

  const { rows } = await pool.query(q, values);
  return rows;
}

export async function countJobs(filters = {}) {
  const conditions = [];
  const values = [];
  let idx = 1;

  if (filters.status) {
    conditions.push(`j.status = $${idx++}`);
    values.push(filters.status);
  }
  if (filters.location) {
    conditions.push(`j.location = $${idx++}`);
    values.push(filters.location);
  }
  if (filters.employment_type) {
    conditions.push(`j.employment_type = $${idx++}`);
    values.push(filters.employment_type);
  }
  if (filters.search) {
    conditions.push(`j.title ILIKE $${idx++}`);
    values.push(`%${filters.search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const q = `
  SELECT COUNT(*)::int AS total
  FROM ats_jobs j
  ${where}
  `;
  const { rows } = await pool.query(q, values);
  return rows[0]?.total ?? 0;
}
