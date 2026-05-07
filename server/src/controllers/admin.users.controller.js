import * as usersService from '../services/users.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../config/logger.js';

export const createHr = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await usersService.createHrUser({ fullName, email, password });

  logger.info('HR user created successfully', { userId: user?.id, email });

  res.status(201).json({
    status: 'success',
    message: 'HR created successfully',
    data: { user },
  });
});
