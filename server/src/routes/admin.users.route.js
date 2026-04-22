import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { createHrValidation } from '../validators/users.validator.js';
import { validate } from '../middleware/validate.middleware.js';
import { createHr } from '../controllers/admin.users.controller.js';

const router = express.Router();

router.post(
  '/hr',
  authMiddleware,
  requireRole('admin'),
  createHrValidation,
  validate,
  createHr,
);

export default router;
