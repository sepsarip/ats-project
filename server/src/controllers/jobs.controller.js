import * as jobsService from '../services/jobs.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../config/logger.js';

export const createJob = asyncHandler(async (req, res) => {
  const payload = req.body;
  const postedBy = req.user && req.user.id;
  logger.info('Create job request received', {
    postedBy,
    title: payload?.title,
  });
  const job = await jobsService.createJob(postedBy, payload);

  logger.info('Job created successfully', { jobId: job?.id, postedBy });

  res.status(201).json({
    status: 'success',
    message: 'Job created successfully',
    data: { job },
  });
});
