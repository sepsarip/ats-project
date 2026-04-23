import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { createJobValidation } from '../validators/jobs.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { createJob } from '../controllers/jobs.controller.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  requireRole(['admin', 'hr']),
  createJobValidation,
  validate,
  createJob,
);

export default router;
