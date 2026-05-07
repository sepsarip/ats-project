import { env } from '../config/env.js';
import fs from 'fs';
import logger from '../config/logger.js';
import { HttpError } from '../utils/HttpError.js';

// internal function to post file to AI service for extraction
async function postFileForExtraction(filePath) {
  if (!env.aiServiceUrl) {
    throw new HttpError(
      500,
      'AI service URL not configured',
      'AI_SERVICE_CONFIG_ERROR',
    );
  }

  const form = new FormData();
  const stream = fs.createReadStream(filePath);
  form.append('file', stream);

  const res = await fetch(`${env.aiServiceUrl.replace(/\/$/, '')}/extract/cv`, {
    method: 'POST',
    body: form,
  });
  logger.info('AI service response received', {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
  });

  if (!res.ok) {
    const txt = await res.text();
    logger.warn('AI service error:', txt);
    throw new Error(`AI service error: ${res.status} ${txt}`);
  }

  const json = await res.json();
  return json;
}

// main function to extract CV text using AI service
export async function extractCv(filePath) {
  try {
    const resp = await postFileForExtraction(filePath);
    return resp && resp.extracted_text ? resp.extracted_text : '';
  } catch (err) {
    logger.warn('AI extraction failed:', err.message || err);
    return '';
  }
}
