import * as jobsService from '../services/jobs.service.js';
import * as applicationsService from '../services/applications.service.js';
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

export const listJobs = asyncHandler(async (req, res) => {
  const query = req.query || {};
  const user = req.user || null;

  const result = await jobsService.listJobs(query, user);

  logger.info('Jobs retrieved successfully', {
    userId: user?.id,
    page: query.page,
    limit: query.limit,
  });

  res.status(200).json({
    status: 'success',
    message: 'Jobs retrieved successfully',
    data: result,
  });
});

export const getJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const job = await jobsService.getJobById(jobId, req.user || null);
  logger.info('Get job request received', { jobId });

  res.status(200).json({
    status: 'success',
    message: 'Job retrieved successfully',
    data: { job },
  });
});

export const updateJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const payload = req.body;
  const user = req.user && req.user.id;

  logger.info('Update job request received', { jobId, userId: user });

  const job = await jobsService.updateJob(user, jobId, payload);

  logger.info('Job updated successfully', { jobId: job?.id, updatedBy: user });

  res.status(200).json({
    status: 'success',
    message: 'Job updated successfully',
    data: { job },
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const user = req.user && req.user.id;
  logger.info('Delete job request received', { jobId, userId: user });

  const deletedJob = await jobsService.deleteJob(user, jobId);

  logger.info('Job deleted successfully', {
    jobId: deletedJob?.id,
    deletedBy: user,
  });

  res.status(200).json({
    status: 'success',
    message: 'Job deleted successfully',
    data: { job: deletedJob },
  });
});

export const getJobCandidates = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const query = req.query || {};

  const result = await applicationsService.getCandidatesByJob(query, jobId);

  logger.info('Job candidates retrieved', { jobId });

  res.status(200).json({
    status: 'success',
    message: 'Candidates retrieved successfully',
    data: result,
  });
});
