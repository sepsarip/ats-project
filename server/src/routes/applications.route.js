import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  myApplicationsValidation,
  updateApplicationStatusValidation,
} from '../validators/applications.validator.js';
import {
  getMyApplications,
  updateApplicationStatus,
} from '../controllers/applications.controller.js';

const router = express.Router();

// Get my applications with pagination for jobseeker
router.get(
  '/me',
  authMiddleware,
  requireRole('jobseeker'),
  myApplicationsValidation,
  validate,
  getMyApplications,
);

// Update application status
router.patch(
  '/:applicationId/status',
  authMiddleware,
  requireRole(['admin', 'hr']),
  updateApplicationStatusValidation,
  validate,
  updateApplicationStatus,
);

export default router;
