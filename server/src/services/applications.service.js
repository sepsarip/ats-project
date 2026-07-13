import { pool } from '../config/db.js';
import { HttpError } from '../utils/HttpError.js';
import logger from '../config/logger.js';
import * as jobsModel from '../models/jobs.model.js';
import * as profilesModel from '../models/profiles.model.js';
import * as applicationsModel from '../models/applications.model.js';
import * as resumeFilesModel from '../models/resumeFiles.model.js';
import * as aiService from './ai.service.js';

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

    if (!profileRow.resume_id) {
      throw new HttpError(
        400,
        'Please upload your resume before applying',
        'RESUME_NOT_FOUND',
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
      resume_file_id: profileRow.resume_id,
    });

    await client.query('COMMIT');

    const result = {
      id: application.id,
      job: { id: job.id, title: job.title },
      status: application.status,
      applied_at: application.applied_at,
      resume: {
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

    // Background task to score the application using AI service
    (async () => {
      try {
        const bgClient = await pool.connect();
        try {
          const cvRow = await resumeFilesModel.getByUserId(bgClient, userId);
          if (!cvRow || !cvRow.extracted_text) {
            logger.info(
              'No extracted resume text available, skipping scoring',
              {
                userId,
                applicationId: application.id,
              },
            );
            return;
          }

          const jobRow = await jobsModel.getJobById(jobId);
          if (!jobRow) {
            logger.warn('Job not found during background scoring, skipping', {
              jobId,
              applicationId: application.id,
            });
            return;
          }

          // normalize job fields
          let requirements = jobRow.requirements;
          let descriptions = jobRow.descriptions;
          try {
            if (typeof requirements === 'string')
              requirements = JSON.parse(requirements || '[]');
          } catch (e) {
            requirements = [];
          }
          try {
            if (typeof descriptions === 'string')
              descriptions = JSON.parse(descriptions || '[]');
          } catch (e) {
            descriptions = [];
          }

          const payload = {
            application_id: application.id,
            extracted_text_resume: cvRow.extracted_text,
            job_info: {
              title: jobRow.title,
              requirements: requirements || [],
              descriptions: descriptions || [],
            },
          };

          const resp = await aiService.scoreResume(payload);
          if (resp && typeof resp.score === 'number') {
            try {
              await applicationsModel.updateApplicationScoreById(
                bgClient,
                application.id,
                resp.score,
              );
              logger.info('Application score updated', {
                applicationId: application.id,
                score: resp.score,
              });
            } catch (err) {
              logger.warn('Failed to update application score', {
                applicationId: application.id,
                error: err && err.message,
              });
            }
          } else {
            logger.info('AI scoring did not return score', {
              applicationId: application.id,
            });
          }
        } finally {
          bgClient.release();
        }
      } catch (err) {
        logger.error('Background scoring task failed', {
          error: err && err.message,
        });
      }
    })();
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

export async function getCandidatesByJob(query, jobId) {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 10, 50);
  const offset = (page - 1) * limit;

  const filters = {
    status: query.status || null,
    gender: query.gender || null,
    city: query.city || null,
    province: query.province || null,
  };

  try {
    const job = await jobsModel.getJobById(jobId);
    if (!job) {
      throw new HttpError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    const total = await applicationsModel.countApplicationsByJob(
      jobId,
      filters,
    );
    const rows = await applicationsModel.listCandidatesByJob(jobId, filters, {
      limit,
      offset,
    });

    const candidates = rows.map((r) => ({
      application_id: r.application_id,
      user: {
        id: r.user_id,
        full_name: r.full_name,
        email: r.email,
        city: r.city,
        province: r.province,
        gender: r.gender,
      },
      status: r.status,
      score: r.score != null ? Number(r.score) : null,
      applied_at: r.applied_at,
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

    logger.info('Candidates fetched by specific job', {
      jobId,
      page,
      limit,
      total,
    });

    return {
      job: { id: job.id, title: job.title, status: job.status },
      candidates,
      meta,
    };
  } catch (err) {
    logger.error('Error retrieving candidates by specific job', {
      error: err,
      jobId,
    });
    if (err instanceof HttpError) throw err;
    throw new HttpError(
      500,
      'Failed to retrieve candidates',
      'CANDIDATE_LIST_FAILED',
    );
  }
}

export async function getCandidateDetail(jobId, userId) {
  try {
    const job = await jobsModel.getJobById(jobId);
    if (!job) {
      throw new HttpError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    const row = await applicationsModel.getApplicationWithCandidateDetail(
      jobId,
      userId,
    );

    if (!row) {
      throw new HttpError(
        404,
        'Application not found for given job and user',
        'APPLICATION_NOT_FOUND',
      );
    }

    const result = {
      job: { id: row.job_id, title: row.job_title, status: row.job_status },
      application: {
        id: row.application_id,
        status: row.application_status,
        score:
          row.application_score != null ? Number(row.application_score) : null,
        applied_at: row.application_applied_at,
      },
      user: {
        id: row.user_id,
        fullName: row.user_full_name,
        email: row.user_email,
      },
      profile: {
        phone: row.profile_phone,
        city: row.profile_city,
        province: row.profile_province,
        bio: row.profile_bio,
        linkedin_url: row.profile_linkedin_url,
        portfolio_url: row.profile_portfolio_url,
        birth_date: row.profile_birth_date,
      },
      resume: {
        file_name: row.resume_file_name,
        file_path: row.resume_file_path,
        mime_type: row.resume_mime_type,
      },
    };

    logger.info('Candidate detail fetched', { jobId, userId });
    return result;
  } catch (err) {
    logger.error('Error fetching candidate detail', {
      error: err,
      jobId,
      userId,
    });
    if (err instanceof HttpError) throw err;
    throw new HttpError(
      500,
      'Failed to retrieve candidate detail',
      'CANDIDATE_DETAIL_FAILED',
    );
  }
}

export async function getCandidateResumeDownloadInfo(jobId, userId) {
  try {
    const job = await jobsModel.getJobById(jobId);
    if (!job) throw new HttpError(404, 'Job not found', 'JOB_NOT_FOUND');

    const row = await applicationsModel.getCandidatesResumeFile(jobId, userId);

    if (!row) {
      throw new HttpError(
        404,
        'Application or resume not found for given job and user',
        'RESUME_NOT_FOUND',
      );
    }
    if (!row.file_path) {
      throw new HttpError(404, 'Resume not found', 'RESUME_NOT_FOUND');
    }

    return {
      file_name: row.file_name,
      mime_type: row.mime_type,
      file_path: row.file_path,
    };
  } catch (err) {
    if (err instanceof HttpError) throw err;
    logger.error('Error retrieving resume download info', {
      error: err,
      jobId,
      userId,
    });
    throw new HttpError(
      500,
      'Failed to retrieve resume info',
      'RESUME_RETRIEVE_FAILED',
    );
  }
}

export async function updateApplicationStatus(applicationId, status) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const application = await applicationsModel.getApplicationById(
      client,
      applicationId,
    );
    if (!application) {
      throw new HttpError(
        404,
        'Application not found',
        'APPLICATION_NOT_FOUND',
      );
    }

    // If the status is the same as current, just return without updating
    if (application.status === status) {
      await client.query('COMMIT');
      return {
        id: application.id,
        status: application.status,
        score: application.score != null ? Number(application.score) : null,
        updated_at: application.updated_at,
      };
    }

    const updated = await applicationsModel.updateApplicationStatusById(
      client,
      applicationId,
      status,
    );

    await client.query('COMMIT');

    return {
      id: updated.id,
      status: updated.status,
      score: updated.score != null ? Number(updated.score) : null,
      updated_at: updated.updated_at,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    if (err instanceof HttpError) throw err;
    logger.error('Error updating application status', { error: err });
    throw new HttpError(
      500,
      'Failed to update application status',
      'UPDATE_FAILED',
    );
  } finally {
    client.release();
  }
}
