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
  pgm.createTable('cv_files', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      unique: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    file_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    file_path: {
      type: 'varchar(255)',
      notNull: true,
    },
    mime_type: {
      type: 'varchar(100)',
      notNull: true,
    },
    file_size: {
      type: 'integer',
      notNull: true,
    },
    extracted_text: {
      type: 'text',
      notNull: true,
    },
    uploaded_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('cv_files');
};
