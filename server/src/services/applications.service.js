import { pool } from '../config/db.js';
import { HttpError } from '../utils/HttpError.js';
import logger from '../config/logger.js';
import * as jobsModel from '../models/jobs.model.js';
import * as profilesModel from '../models/profiles.model.js';
import * as applicationsModel from '../models/applications.model.js';

export async function applyToJob(userId, jobId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const job = await jobsModel.getJobById(jobId);
    if (!job) {
      throw new HttpError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    if (job.status !== 'open') {
      throw new HttpError(
        403,
        'Job is not open for applications',
        'JOB_NOT_OPEN',
      );
    }

    const profileRow = await profilesModel.findFullProfileByUserId(
      client,
      userId,
    );
    if (!profileRow) {
      throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');
    }

    if (!profileRow.cv_id) {
      throw new HttpError(
        400,
        'Please upload your CV before applying',
        'CV_NOT_FOUND',
      );
    }

    const existingApplication =
      await applicationsModel.getApplicationByUserIdAndJobId(
        client,
        userId,
        jobId,
      );
    if (existingApplication) {
      throw new HttpError(
        409,
        'You have already applied to this job',
        'ALREADY_APPLIED',
      );
    }
    const application = await applicationsModel.insertApplication(client, {
      job_id: jobId,
      user_id: userId,
      cv_file_id: profileRow.cv_id,
    });

    await client.query('COMMIT');

    const result = {
      id: application.id,
      job: { id: job.id, title: job.title },
      status: application.status,
      applied_at: application.applied_at,
      cv: {
        file_name: profileRow.file_name,
        file_size: profileRow.file_size,
        file_path: profileRow.file_path,
      },
      applicant: {
        fullName: profileRow.full_name,
        phone: profileRow.phone,
        portfolio_url: profileRow.portfolio_url,
      },
    };

    logger.info('Application submitted', {
      applicationId: application.id,
      userId,
      jobId,
    });
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof HttpError) throw err;
    logger.error('Error applying to job', { error: err });
    throw new HttpError(
      500,
      'Failed to submit application',
      'APPLICATION_CREATION_FAILED',
    );
  } finally {
    client.release();
  }
}

export async function getMyApplications(query, userId) {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 10, 50);
  const offset = (page - 1) * limit;

  try {
    const total = await applicationsModel.countApplicationsByUser(userId);
    const rows = await applicationsModel.listApplicationsByUser(userId, {
      limit,
      offset,
    });

    const applications = rows.map((r) => ({
      id: r.id,
      job: {
        id: r.job_id,
        title: r.job_title,
        employment_type: r.job_employment_type,
        location: r.job_location,
        min_salary: r.job_min_salary,
        max_salary: r.job_max_salary,
        status: r.job_status,
      },
      status: r.status,
      score: r.score != null ? Number(r.score) : null,
      applied_at: r.applied_at,
      updated_at: r.updated_at,
    }));

    const totalPages = Math.ceil(total / limit) || 0;

    const meta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1 && page <= totalPages,
    };

    logger.info('My applications fetched', { userId, page, limit, total });

    return { applications, meta };
  } catch (err) {
    logger.error('Error retrieving my applications', { error: err });
    throw new HttpError(
      500,
      'Failed to retrieve applications',
      'APPLICATION_LIST_FAILED',
    );
  }
}
