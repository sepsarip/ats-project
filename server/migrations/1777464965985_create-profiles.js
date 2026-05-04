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
  pgm.createType('gender_enum', ['male', 'female']);

  pgm.createTable('profiles', {
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
    phone: {
      type: 'varchar(20)',
      notNull: false,
    },
    city: {
      type: 'varchar(100)',
      notNull: false,
    },
    province: {
      type: 'varchar(100)',
      notNull: false,
    },
    bio: {
      type: 'text',
      notNull: false,
    },
    linkedin_url: {
      type: 'varchar(255)',
      notNull: false,
    },
    portfolio_url: {
      type: 'varchar(255)',
      notNull: false,
    },
    birth_date: {
      type: 'date',
      notNull: false,
    },
    gender: {
      type: 'gender_enum',
      notNull: false,
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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('profiles');
  pgm.dropType('gender_enum');
};
