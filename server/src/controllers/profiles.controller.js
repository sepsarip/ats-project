import { asyncHandler } from '../utils/asyncHandler.js';
import logger from '../config/logger.js';
import * as profilesService from '../services/profiles.service.js';

export const updateMyProfile = asyncHandler(async (req, res) => {
  const userId = req.user && req.user.id;
  const payload = req.body;

  const data = await profilesService.updateMyProfile(userId, payload);
  logger.info('Profile updated successfully', { userId });

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data,
  });
});

export default { updateMyProfile };
