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
  pgm.createType('employment_type_enum', [
    'full-time',
    'part-time',
    'contract',
    'internship',
  ]);
  pgm.createType('job_status_enum', ['draft', 'open', 'closed']);
  pgm.createType('location_enum', ['onsite', 'remote', 'hybrid']);

  pgm.createTable('ats_jobs', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    posted_by: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    title: {
      type: 'varchar(255)',
      notNull: true,
    },
    about: {
      type: 'text',
      notNull: true,
    },
    requirements: {
      type: 'jsonb',
      notNull: true,
      default: '[]',
    },
    descriptions: {
      type: 'jsonb',
      notNull: true,
      default: '[]',
    },
    additional_info: {
      type: 'jsonb',
      notNull: false,
      default: '[]',
    },
    employment_type: {
      type: 'employment_type_enum',
      notNull: true,
    },
    location: {
      type: 'location_enum',
      notNull: true,
    },
    min_salary: {
      type: 'decimal(10, 2)',
      notNull: false,
    },
    max_salary: {
      type: 'decimal(10, 2)',
      notNull: false,
    },
    status: {
      type: 'job_status_enum',
      notNull: true,
      default: 'draft',
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createConstraint('ats_jobs', 'job_salary_check', {
    check:
      '((min_salary IS NULL) OR (max_salary IS NULL) OR (min_salary <= max_salary))',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('ats_jobs');
  pgm.dropType('employment_type_enum');
  pgm.dropType('job_status_enum');
  pgm.dropType('location_enum');
  pgm.dropConstraint('ats_jobs', 'job_salary_check');
};
