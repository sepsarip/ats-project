import fs from 'fs/promises';
import path from 'path';

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = async (pgm) => {
  // Rename table cv_files to resume_files
  pgm.renameTable('cv_files', 'resume_files');

  // Rename column cv_file_id in applications to resume_file_id
  pgm.renameColumn('applications', 'cv_file_id', 'resume_file_id');

  // Update file paths in database from /uploads/cv/ to /uploads/resume/ and _cv.pdf to _resume.pdf
  pgm.sql(`
    UPDATE resume_files 
    SET file_path = REPLACE(REPLACE(file_path, '/uploads/cv/', '/uploads/resume/'), '_cv.pdf', '_resume.pdf')
  `);

  // Move files on disk from uploads/cv to uploads/resume
  const oldDir = path.resolve('uploads', 'cv');
  const newDir = path.resolve('uploads', 'resume');

  try {
    await fs.mkdir(newDir, { recursive: true });
    if (await fs.stat(oldDir).catch(() => null)) {
      const files = await fs.readdir(oldDir);
      for (const file of files) {
        if (file.endsWith('_cv.pdf')) {
          const oldFilePath = path.join(oldDir, file);
          const newFileName = file.replace('_cv.pdf', '_resume.pdf');
          const newFilePath = path.join(newDir, newFileName);
          await fs.rename(oldFilePath, newFilePath);
        } else {
          const oldFilePath = path.join(oldDir, file);
          const newFilePath = path.join(newDir, file);
          await fs.rename(oldFilePath, newFilePath);
        }
      }
      // Remove old directory if empty
      const remainingFiles = await fs.readdir(oldDir);
      if (remainingFiles.length === 0) {
        await fs.rmdir(oldDir);
      }
    }
  } catch (err) {
    console.error('Error migrating files on disk (up):', err);
  }
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = async (pgm) => {
  // Move files on disk back from uploads/resume to uploads/cv
  const oldDir = path.resolve('uploads', 'resume');
  const newDir = path.resolve('uploads', 'cv');

  try {
    await fs.mkdir(newDir, { recursive: true });
    if (await fs.stat(oldDir).catch(() => null)) {
      const files = await fs.readdir(oldDir);
      for (const file of files) {
        if (file.endsWith('_resume.pdf')) {
          const oldFilePath = path.join(oldDir, file);
          const newFileName = file.replace('_resume.pdf', '_cv.pdf');
          const newFilePath = path.join(newDir, newFileName);
          await fs.rename(oldFilePath, newFilePath);
        } else {
          const oldFilePath = path.join(oldDir, file);
          const newFilePath = path.join(newDir, file);
          await fs.rename(oldFilePath, newFilePath);
        }
      }
      const remainingFiles = await fs.readdir(oldDir);
      if (remainingFiles.length === 0) {
        await fs.rmdir(oldDir);
      }
    }
  } catch (err) {
    console.error('Error migrating files on disk (down):', err);
  }

  // Restore file paths in database
  pgm.sql(`
    UPDATE resume_files 
    SET file_path = REPLACE(REPLACE(file_path, '/uploads/resume/', '/uploads/cv/'), '_resume.pdf', '_cv.pdf')
  `);

  // Rename column resume_file_id back to cv_file_id
  pgm.renameColumn('applications', 'resume_file_id', 'cv_file_id');

  // Rename table resume_files back to cv_files
  pgm.renameTable('resume_files', 'cv_files');
};
