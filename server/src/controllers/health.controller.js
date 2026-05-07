import { checkDatabaseConnection } from '../config/db.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { HttpError } from '../utils/HttpError.js';

export const getApiHealth = asyncHandler(async (req, res) => {
  await checkDatabaseConnection();

  res.status(200).json({
    success: true,
    service: 'ats-server',
    status: 'ok',
    aiServiceUrl: env.aiServiceUrl,
  });
});

export const getAiHealth = asyncHandler(async (req, res) => {
  const response = await fetch(`${env.aiServiceUrl}/health`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new HttpError(
      502,
      'AI service health check failed',
      'AI_SERVICE_UNAVAILABLE',
    );
  }

  const payload = await response.json();
  res.status(200).json({ success: true, data: payload });
});
