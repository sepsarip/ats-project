import * as usersService from '../services/users.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createHr = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await usersService.createHrUser({ fullName, email, password });
  res.status(201).json({
    status: 'success',
    message: 'HR created successfully',
    data: { user },
  });
});
