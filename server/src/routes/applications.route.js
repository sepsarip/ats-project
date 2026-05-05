import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { myApplicationsValidation } from '../validators/applications.validator.js';
import { getMyApplications } from '../controllers/applications.controller.js';

const router = express.Router();

router.get(
  '/me',
  authMiddleware,
  requireRole('jobseeker'),
  myApplicationsValidation,
  validate,
  getMyApplications,
);

export default router;
