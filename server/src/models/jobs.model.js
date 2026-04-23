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
