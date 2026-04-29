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
} from '../controllers/jobs.controller.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole(['admin', 'hr']),
  createJobValidation,
  validate,
  createJob,
);

router.get('/', optionalAuthMiddleware, listJobsValidation, validate, listJobs);

router.get('/:id', optionalAuthMiddleware, getJobValidation, validate, getJob);

router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'hr']),
  updateJobValidation,
  validate,
  updateJob,
);

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin', 'hr']),
  deleteJobValidation,
  validate,
  deleteJob,
);

export default router;
