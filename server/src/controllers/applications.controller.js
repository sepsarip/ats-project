import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../config/logger.js';
import * as applicationsService from '../services/applications.service.js';

export const applyToJob = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  const jobId = req.params.jobId;

  logger.info('Apply to job request received', { userId, jobId });

  const application = await applicationsService.applyToJob(userId, jobId);

  logger.info('Application submitted successfully', {
    userId,
    jobId,
    applicationId: application.id,
  });

  res.status(200).json({
    status: 'success',
    message: 'Application submitted successfully',
    data: { application },
  });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  const query = req.query || {};

  logger.info('Get my applications request received', { userId, query });

  const { applications, meta } = await applicationsService.getMyApplications(
    query,
    userId,
  );

  logger.info('My applications retrieved', {
    userId,
    count: applications.length,
  });

  res.status(200).json({
    status: 'success',
    message: 'Applications retrieved successfully',
    data: { applications, meta },
  });
});
