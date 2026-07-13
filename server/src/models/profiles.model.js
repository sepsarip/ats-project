export async function upsertProfile(client, userId, payload) {
  const q = `
    INSERT INTO profiles (
        user_id, phone, city, province,
        bio, linkedin_url, portfolio_url,
        birth_date, gender, updated_at
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        phone = COALESCE(EXCLUDED.phone, profiles.phone),
        city = COALESCE(EXCLUDED.city, profiles.city),
        province = COALESCE(EXCLUDED.province, profiles.province),
        bio = COALESCE(EXCLUDED.bio, profiles.bio),
        linkedin_url = COALESCE(EXCLUDED.linkedin_url, profiles.linkedin_url),
        portfolio_url = COALESCE(EXCLUDED.portfolio_url, profiles.portfolio_url),
        birth_date = COALESCE(EXCLUDED.birth_date, profiles.birth_date),
        gender = COALESCE(EXCLUDED.gender, profiles.gender),
        updated_at = NOW()
    RETURNING *;`;

  const values = [
    userId,
    payload.phone,
    payload.city,
    payload.province,
    payload.bio,
    payload.linkedin_url,
    payload.portfolio_url,
    payload.birth_date,
    payload.gender,
  ];

  const { rows } = await client.query(q, values);
  return rows[0] || null;
}

export async function findFullProfileByUserId(client, userId) {
  const q = `
    SELECT
      u.id AS user_id,
      u.full_name,
      u.email,
      p.id AS profile_id,
      p.phone,
      p.city,
      p.province,
      p.bio,
      p.linkedin_url,
      p.portfolio_url,
      p.birth_date,
      p.gender,
      c.id AS resume_id,
      c.file_name,
      c.file_path,
      c.mime_type,
      c.file_size,
      c.uploaded_at
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    LEFT JOIN resume_files c ON c.user_id = u.id
    WHERE u.id = $1
    LIMIT 1
  `;

  const { rows } = await client.query(q, [userId]);
  return rows[0] || null;
}
