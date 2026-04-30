import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import updateProfileValidation from '../validators/profiles.validator.js';
import { updateMyProfile } from '../controllers/profiles.controller.js';

const router = express.Router();

router.put(
  '/me',
  authMiddleware,
  requireRole('jobseeker'),
  updateProfileValidation,
  validate,
  updateMyProfile,
);

export default router;
