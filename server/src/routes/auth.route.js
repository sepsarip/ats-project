import express from 'express';
import { register } from '../controllers/auth.controller.js';
import { registerValidation } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

router.post('/register', registerValidation, validate, register);

export default router;
