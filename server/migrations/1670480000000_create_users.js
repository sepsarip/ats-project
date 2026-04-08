/* create users table migration for node-pg-migrate */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    full_name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true },
    password: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(50)', notNull: true, default: 'jobseeker' },
    is_active: { type: 'boolean', notNull: true, default: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('users', 'users_email_unique', {
    unique: ['email'],
  });
};

export const down = (pgm) => {
  pgm.dropTable('users');
};
