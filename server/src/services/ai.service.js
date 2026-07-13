import { env } from '../config/env.js';
import fs from 'fs';
import path from 'path';
import logger from '../config/logger.js';
import { HttpError } from '../utils/HttpError.js';
import axios from 'axios';
import FormData from 'form-data';

// internal function to post file to AI service for extraction
async function postFileForExtraction(filePath) {
  if (!env.aiServiceUrl) {
    throw new HttpError(
      500,
      'AI service URL not configured',
      'AI_SERVICE_CONFIG_ERROR',
    );
  }

  try {
    // Create form-data instance
    const form = new FormData();
    const fileName = path.basename(filePath);

    // Append file stream with metadata
    form.append('file', fs.createReadStream(filePath), {
      filename: fileName,
      contentType: 'application/pdf',
    });

    // axios handles form-data + headers automatically
    const response = await axios.post(
      `${env.aiServiceUrl.replace(/\/$/, '')}/extract-text`,
      form,
      {
        headers: form.getHeaders(),
        timeout: Number(env.aiServiceTimeoutMs) || 15000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    logger.info('AI service response received', {
      status: response.status,
      statusText: response.statusText,
    });

    // Parse successful response
    if (response.data?.status === 'success' && response.data.data) {
      return response.data.data;
    }

    // Handle AI service error response
    if (response.data?.status === 'error') {
      logger.warn('AI service returned error', {
        message: response.data.message,
        code: response.data.code,
      });
      return null;
    }

    logger.warn('AI service returned unexpected format', {
      status: response.data?.status,
      data: response.data,
    });
    return null;
  } catch (err) {
    // Handle axios errors
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      logger.warn('AI service request timeout', {
        timeoutMs: env.aiServiceTimeoutMs,
      });
      return null;
    }

    if (err.code === 'ECONNREFUSED') {
      logger.error('AI service not reachable', {
        url: env.aiServiceUrl,
        error: err.message,
      });
      return null;
    }

    logger.warn('AI service request failed', {
      message: err.message,
      code: err.code,
      response: err.response?.data,
    });
    return null;
  }
}

// main function to extract Resume text using ai-service
export async function extractResume(filePath) {
  try {
    const resp = await postFileForExtraction(filePath);
    return resp || null;
  } catch (err) {
    logger.warn('AI extraction failed:', err.message || err);
    return null;
  }
}

// Post scoring payload to AI service
export async function scoreResume(payload) {
  if (!env.aiServiceUrl) {
    throw new Error('AI service URL not configured');
  }

  try {
    const url = `${env.aiServiceUrl.replace(/\/$/, '')}/score-resume-job`;
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: Number(env.aiServiceTimeoutMs) || 15000,
    });

    logger.info('AI scoring response received', {
      status: response.status,
      statusText: response.statusText,
    });

    if (response.data?.status === 'success' && response.data.data) {
      return response.data.data;
    }

    if (response.data?.status === 'accepted' && response.data.data) {
      // queued
      return response.data.data;
    }

    if (response.data?.status === 'error') {
      logger.warn('AI scoring returned error', {
        message: response.data.message,
        code: response.data.code,
      });
      return null;
    }

    logger.warn('AI scoring returned unexpected format', {
      data: response.data,
    });
    return null;
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      logger.warn('AI scoring request timeout', {
        timeoutMs: env.aiServiceTimeoutMs,
      });
      return null;
    }

    if (err.code === 'ECONNREFUSED') {
      logger.error('AI service not reachable for scoring', {
        url: env.aiServiceUrl,
        error: err.message,
      });
      return null;
    }

    logger.warn('AI scoring request failed', {
      message: err.message,
      code: err.code,
      response: err.response?.data,
    });
    return null;
  }
}
