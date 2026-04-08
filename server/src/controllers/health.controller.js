import { checkDatabaseConnection } from '../config/db.js';
import { env } from '../config/env.js';

export async function getApiHealth(req, res, next) {
  try {
    await checkDatabaseConnection();

    res.status(200).json({
      success: true,
      service: 'ats-server',
      status: 'ok',
      aiServiceUrl: env.aiServiceUrl,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAiHealth(req, res, next) {
  try {
    const response = await fetch(`${env.aiServiceUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const err = new Error('AI service health check failed');
      err.statusCode = 502;
      throw err;
    }

    const payload = await response.json();
    res.status(200).json({ success: true, data: payload });
  } catch (error) {
    next(error);
  }
}
