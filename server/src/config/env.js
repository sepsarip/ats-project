import dotenv from 'dotenv';

dotenv.config();

const required = [
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'AI_SERVICE_URL',
  'AI_SERVICE_TIMEOUT_MS',
  'ADMIN_FULL_NAME',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  aiServiceUrl: process.env.AI_SERVICE_URL,
  aiServiceTimeoutMs: process.env.AI_SERVICE_TIMEOUT_MS || '15000',
  admin: {
    fullName: process.env.ADMIN_FULL_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  googleEmailUser: process.env.GOOGLE_EMAIL_USER,
  googleAppPassword: process.env.GOOGLE_APP_PASSWORD,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
