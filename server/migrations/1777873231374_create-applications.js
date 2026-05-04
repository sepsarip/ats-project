/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createType('application_status', [
    'applied',
    'rejected',
    'interview',
    'offered',
    'hired',
  ]);
  pgm.createTable('applications', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    job_id: {
      type: 'integer',
      notNull: true,
      references: 'ats_jobs',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    cv_file_id: {
      type: 'integer',
      references: 'cv_files',
      onDelete: 'RESTRICT',
    },
    status: {
      type: 'application_status',
      notNull: true,
      default: 'applied',
    },
    score: {
      type: 'decimal(5,2)',
    },
    applied_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createConstraint('applications', 'unique_user_job_application', {
    unique: ['user_id', 'job_id'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropConstraint('applications', 'unique_user_job_application');
  pgm.dropTable('applications');
  pgm.dropType('application_status');
};
