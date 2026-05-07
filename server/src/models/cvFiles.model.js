import { pool } from '../config/db.js';

export async function upsertByUserId(
  client,
  userId,
  { file_name, file_path, mime_type, file_size, extracted_text = '' },
) {
  const q = `
    INSERT INTO cv_files (user_id, file_name, file_path, mime_type, file_size, extracted_text)
    VALUES ($1,$2,$3,$4,$5,$6)
    ON CONFLICT (user_id) DO UPDATE SET
        file_name = EXCLUDED.file_name,
        file_path = EXCLUDED.file_path,
        mime_type = EXCLUDED.mime_type,
        file_size = EXCLUDED.file_size,
        extracted_text = COALESCE(EXCLUDED.extracted_text, cv_files.extracted_text),
        uploaded_at = NOW()
    RETURNING *;`;

  const values = [
    userId,
    file_name,
    file_path,
    mime_type,
    file_size,
    extracted_text,
  ];
  const { rows } = await client.query(q, values);
  return rows[0] || null;
}

export async function updateExtractedText(userId, extracted_text) {
  const q = `UPDATE cv_files SET extracted_text = $2 WHERE user_id = $1 RETURNING *`;
  const { rows } = await pool.query(q, [userId, extracted_text]);
  return rows[0] || null;
}

export async function getByUserId(client, userId) {
  const q = `SELECT * FROM cv_files WHERE user_id = $1 LIMIT 1`;
  const { rows } = await client.query(q, [userId]);
  return rows[0] || null;
}

export async function deleteByUserId(client, userId) {
  const q = `DELETE FROM cv_files WHERE user_id = $1 RETURNING *`;
  const { rows } = await client.query(q, [userId]);
  return rows[0] || null;
}
