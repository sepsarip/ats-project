import express from 'express';
import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import {
  createJobValidation,
  listJobsValidation,
  getJobValidation,
  updateJobValidation,
  deleteJobValidation,
} from '../validators/jobs.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createJob,
  listJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobCandidates,
  getJobCandidateDetail,
  downloadCandidateCv,
} from '../controllers/jobs.controller.js';
import {
  applyValidation,
  candidatesValidation,
  candidateDetailValidation,
} from '../validators/applications.validator.js';
import { applyToJob } from '../controllers/applications.controller.js';

const router = express.Router();

// Create job route
router.post(
  '/',
  authMiddleware,
  requireRole(['admin', 'hr']),
  createJobValidation,
  validate,
  createJob,
);

// List jobs (open to all, but show different info based on auth)
router.get('/', optionalAuthMiddleware, listJobsValidation, validate, listJobs);

// Get job details (open to all, but show different info based on auth)
router.get('/:id', optionalAuthMiddleware, getJobValidation, validate, getJob);

// Update job route
router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'hr']),
  updateJobValidation,
  validate,
  updateJob,
);

// delete job route
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'hr']),
  deleteJobValidation,
  validate,
  deleteJob,
);

// Apply to job route
router.post(
  '/:jobId/apply',
  authMiddleware,
  requireRole('jobseeker'),
  applyValidation,
  validate,
  applyToJob,
);

// Candidates listing for a specific job
router.get(
  '/:jobId/candidates',
  authMiddleware,
  requireRole(['admin', 'hr']),
  candidatesValidation,
  validate,
  getJobCandidates,
);

// Candidate detail for a specific job
router.get(
  '/:jobId/candidates/:userId',
  authMiddleware,
  requireRole(['admin', 'hr']),
  candidateDetailValidation,
  validate,
  getJobCandidateDetail,
);

// Download candidate CV for a specific job and user
router.get(
  '/:jobId/candidates/:userId/cv/download',
  authMiddleware,
  requireRole(['admin', 'hr']),
  candidateDetailValidation,
  validate,
  downloadCandidateCv,
);

export default router;
