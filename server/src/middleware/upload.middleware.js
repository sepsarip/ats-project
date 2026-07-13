import multer from 'multer';
import path from 'path';
import fs from 'fs';
import logger from '../config/logger.js';
import { HttpError } from '../utils/HttpError.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(process.cwd(), 'uploads', 'resume');
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (e) {
      logger.error('Error creating upload directory:', e);
      return cb(
        new HttpError(
          500,
          'Failed to create upload directory',
          'UPLOAD_DIR_ERROR',
        ),
      );
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const userId = req.user && req.user.id;
    const name = `user_${userId}_resume.pdf`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype !== 'application/pdf') {
    cb(new HttpError(400, 'Only PDF files are allowed', 'INVALID_FILE_TYPE'));
  } else {
    cb(null, true);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

export default upload;
