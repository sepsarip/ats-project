import { pool } from '../config/db.js';
import { HttpError } from '../utils/HttpError.js';
import logger from '../config/logger.js';
import * as usersModel from '../models/users.model.js';
import * as profilesModel from '../models/profiles.model.js';
import * as cvFilesModel from '../models/cvFiles.model.js';
import * as aiService from './ai.service.js';
import fs from 'fs/promises';
import path from 'path';

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

export async function uploadMyCv(userId, file) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // file: { path, originalname, mimetype, size }
    if (!file) throw new HttpError(400, 'No file uploaded', 'VALIDATION_ERROR');

    const fileName = `user_${userId}_cv.pdf`;
    const destPathAbs = path.join(process.cwd(), 'uploads', 'cv', fileName);
    // public path to store in DB (use forward slashes)
    const destPathDb = `/uploads/cv/${fileName}`;

    // If multer already saved file to a tmp path and destination equals that path,
    // we expect file.path to be the final path. Otherwise move file to dest.
    if (file.path && path.resolve(file.path) !== path.resolve(destPathAbs)) {
      // ensure directory exists
      await fs.mkdir(path.dirname(destPathAbs), { recursive: true });
      await fs.rename(file.path, destPathAbs);
    }

    const row = await cvFilesModel.upsertByUserId(client, userId, {
      file_name: file.originalname || fileName,
      file_path: destPathDb,
      mime_type: file.mimetype || 'application/pdf',
      file_size: file.size || 0,
      extracted_text: '',
    });

    await client.query('COMMIT');

    (async () => {
      try {
        const extracted = await aiService.extractCv(destPathAbs);
        if (extracted && extracted.length > 0) {
          await cvFilesModel.updateExtractedText(userId, extracted);
        }
      } catch (err) {
        logger.error('Error extracting CV text:', err);
      }
    })();

    return {
      cv: {
        id: row.id,
        file_name: row.file_name,
        file_path: row.file_path,
        mime_type: row.mime_type,
        file_size: row.file_size,
        uploaded_at: row.uploaded_at,
      },
    };
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof HttpError) throw err;
    logger.error('Error uploading CV:', err);
    throw new HttpError(500, 'Failed to upload CV', 'CV_UPLOAD_FAILED');
  } finally {
    client.release();
  }
}

export async function getMyProfile(userId) {
  const client = await pool.connect();
  try {
    const row = await profilesModel.findFullProfileByUserId(client, userId);
    if (!row) throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');

    const user = {
      id: row.user_id,
      fullName: row.full_name,
      email: row.email,
    };

    let profile = null;
    if (row.profile_id !== null) {
      profile = {
        id: row.profile_id,
        phone: row.phone,
        city: row.city,
        province: row.province,
        bio: row.bio,
        linkedin_url: row.linkedin_url,
        portfolio_url: row.portfolio_url,
        birth_date: row.birth_date,
        gender: row.gender,
      };
    }

    let cv = null;
    if (row.cv_id !== null) {
      cv = {
        id: row.cv_id,
        file_name: row.file_name,
        mime_type: row.mime_type,
        file_path: row.file_path,
        file_size: row.file_size,
        uploaded_at: row.uploaded_at,
      };
    }

    return { user, profile, cv };
  } catch (err) {
    if (err instanceof HttpError) throw err;
    logger.error('Error fetching profile:', err);
    throw new HttpError(
      500,
      'Failed to retrieve profile',
      'PROFILE_RETRIEVE_FAILED',
    );
  } finally {
    client.release();
  }
}

export async function deleteMyCv(userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const row = await cvFilesModel.getByUserId(client, userId);
    if (!row) {
      throw new HttpError(404, 'CV not found', 'CV_NOT_FOUND');
    }

    const relPath = row.file_path && row.file_path.replace(/^\//, '');
    const absPath = path.join(process.cwd(), relPath);

    const deleted = await cvFilesModel.deleteByUserId(client, userId);

    await client.query('COMMIT');

    try {
      await fs.unlink(absPath);
      logger.info('CV file deleted from disk', { userId, file: absPath });
    } catch (err) {
      logger.warn('Failed to delete CV file from disk', {
        userId,
        file: absPath,
        error: err && err.message,
      });
    }

    return { status: 'success', message: 'CV deleted successfully' };
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof HttpError) throw err;
    logger.error('Error deleting CV:', err);
    throw new HttpError(500, 'Failed to delete CV', 'CV_DELETE_FAILED');
  } finally {
    client.release();
  }
}
