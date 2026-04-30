import { pool } from '../config/db.js';
import { HttpError } from '../utils/HttpError.js';
import logger from '../config/logger.js';
import * as usersModel from '../models/users.model.js';
import * as profilesModel from '../models/profiles.model.js';

export async function updateMyProfile(userId, payload) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const user = await usersModel.findById(userId);
    if (!user) {
      throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');
    }

    let updatedUser = user;
    if (payload.fullName !== undefined) {
      const u = await usersModel.updateFullNameById(
        client,
        userId,
        payload.fullName,
      );
      if (!u) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');
      updatedUser = u;
    }

    const profile = await profilesModel.upsertProfile(client, userId, payload);

    await client.query('COMMIT');

    return {
      user: {
        id: updatedUser.id,
        fullName: updatedUser.full_name,
        email: updatedUser.email,
      },
      profile: {
        phone: profile.phone,
        city: profile.city,
        province: profile.province,
        bio: profile.bio,
        linkedin_url: profile.linkedin_url,
        portfolio_url: profile.portfolio_url,
        birth_date: profile.birth_date,
        gender: profile.gender,
        updated_at: profile.updated_at,
      },
    };
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof HttpError) throw err;
    logger.error('Error updating profile:', err);
    throw new HttpError(
      500,
      'Failed to update profile',
      'PROFILE_UPDATE_FAILED',
    );
  } finally {
    client.release();
  }
}

export default { updateMyProfile };
