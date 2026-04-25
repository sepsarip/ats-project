import * as jobsModel from '../models/jobs.model.js';
import { HttpError } from '../utils/HttpError.js';
import logger from '../config/logger.js';

export async function createJob(postedBy, data) {
  if (!postedBy) {
    throw new HttpError(
      401,
      'Token tidak valid atau telah kadaluarsa',
      'INVALID_TOKEN',
    );
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
    throw new HttpError(500, 'Gagal membuat pekerjaan', 'JOB_CREATION_FAILED');
  }
}
