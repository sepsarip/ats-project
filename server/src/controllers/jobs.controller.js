import * as jobsService from '../services/jobs.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createJob = asyncHandler(async (req, res) => {
  const payload = req.body;
  const postedBy = req.user && req.user.id;
  const job = await jobsService.createJob(postedBy, payload);

  res.status(201).json({
    status: 'success',
    message: 'Job created successfully',
    data: { job },
  });
});
