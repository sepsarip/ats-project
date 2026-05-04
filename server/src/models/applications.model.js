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
