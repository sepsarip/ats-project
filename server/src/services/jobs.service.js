import * as jobsModel from '../models/jobs.model.js';
import { HttpError } from '../utils/HttpError.js';
import logger from '../config/logger.js';

export async function createJob(postedBy, data) {
  if (!postedBy) {
    throw new HttpError(401, 'Token is invalid or expired', 'INVALID_TOKEN');
  }

  const payload = {
    posted_by: postedBy,
    title: data.title,
    about: data.about,
    descriptions: data.descriptions || [],
    requirements: data.requirements || [],
    additional_info: data.additional_info || [],
    employment_type: data.employment_type,
    location: data.location,
    min_salary: data.min_salary ?? null,
    max_salary: data.max_salary ?? null,
  };

  try {
    const job = await jobsModel.insertJob(payload);
    logger.info('Job inserted into database', {
      title: payload.title,
      posted_by: postedBy,
      jobId: job?.id,
    });
    return job;
  } catch (err) {
    logger.error('Error inserting job', { error: err });
    throw new HttpError(500, 'Failed to create job', 'JOB_CREATION_FAILED');
  }
}

export async function listJobs(query, user) {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 10, 50);
  const offset = (page - 1) * limit;

  const filters = {};

  const isPrivileged = user && ['admin', 'hr'].includes(user.role);
  if (!isPrivileged) filters.status = 'open';

  if (query.status) filters.status = query.status;
  if (query.location) filters.location = query.location;
  if (query.employment_type) filters.employment_type = query.employment_type;
  if (query.search) filters.search = query.search;

  try {
    const total = await jobsModel.countJobs(filters);
    const jobs = await jobsModel.listJobs(filters, { limit, offset });
    logger.info('Jobs fetched from database', {
      filters,
      page,
      limit,
      total,
    });

    const totalPages = Math.ceil(total / limit) || 0;

    const meta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1 && page <= totalPages,
    };

    return { jobs, meta };
  } catch (err) {
    logger.error('Error listing jobs', { error: err });
    throw new HttpError(500, 'Failed to retrieve jobs', 'JOB_LIST_FAILED');
  }
}

export async function getJobById(id, user) {
  try {
    const job = await jobsModel.getJobById(id);
    if (!job) {
      logger.warn('Job not found', { jobId: id });
      throw new HttpError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    const isPrivileged = user && ['admin', 'hr'].includes(user.role);
    if (!isPrivileged && job.status !== 'open') {
      // prevent jobseeker from accessing non-open jobs
      logger.warn('Forbidden access to non-open job', {
        jobId: id,
        userId: user?.id,
      });
      throw new HttpError(
        403,
        'You are not allowed to access this job',
        'FORBIDDEN',
      );
    }

    logger.info('Job retrieved successfully', { jobId: id });
    return job;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    logger.error('Error retrieving job by ID', { jobId: id, error: err });
    throw new HttpError(500, 'Failed to retrieve job', 'JOB_RETRIEVE_FAILED');
  }
}

export async function updateJob(userId, id, data) {
  if (!userId) {
    throw new HttpError(401, 'Token is invalid or expired', 'INVALID_TOKEN');
  }

  try {
    const existing = await jobsModel.getJobById(id);
    if (!existing) {
      throw new HttpError(404, 'Job not found', 'JOB_NOT_FOUND');
    }

    const payload = {
      title: data.title,
      about: data.about,
      descriptions: data.descriptions,
      requirements: data.requirements,
      additional_info: data.additional_info,
      employment_type: data.employment_type,
      location: data.location,
      min_salary: data.min_salary ?? null,
      max_salary: data.max_salary ?? null,
      status: data.status,
    };

    const updated = await jobsModel.updateJob(id, payload);
    logger.info('Job updated in database', { jobId: id, updatedBy: userId });
    return updated;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    logger.error('Error updating job', { jobId: id, error: err });
    throw new HttpError(500, 'Failed to update job', 'JOB_UPDATE_FAILED');
  }
}
