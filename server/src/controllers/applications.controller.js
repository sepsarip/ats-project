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
