import { asyncHandler } from '../utils/asyncHandler.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardStats();

  res.status(200).json({
    status: 'success',
    message: 'Dashboard statistics retrieved successfully',
    data,
  });
});

export default { getDashboardStats };
