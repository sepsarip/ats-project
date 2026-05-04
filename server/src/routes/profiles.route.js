import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import updateProfileValidation from '../validators/profiles.validator.js';
import {
  updateMyProfile,
  uploadMyCv,
  getMyProfile,
} from '../controllers/profiles.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.put(
  '/me',
  authMiddleware,
  requireRole('jobseeker'),
  updateProfileValidation,
  validate,
  updateMyProfile,
);

router.get('/me', authMiddleware, requireRole('jobseeker'), getMyProfile);

router.post(
  '/cv',
  authMiddleware,
  requireRole('jobseeker'),
  upload.single('cv'),
  uploadMyCv,
);

export default router;
