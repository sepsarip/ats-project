import express from 'express';
import { env } from './config/env.js';
import helmet from 'helmet';
import cors from 'cors';
import morganMiddleware from './config/morgan.js';
import logger from './config/logger.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.route.js';
import adminUsersRoutes from './routes/admin.users.route.js';
import jobsRoutes from './routes/jobs.route.js';
import profilesRoutes from './routes/profiles.route.js';
import applicationsRoutes from './routes/applications.route.js';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morganMiddleware);
app.use(express.json({ limit: '1mb' }));

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/applications', applicationsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(
    `ATS server listening on port ${env.port} timestamp ${new Date().toISOString()}`,
  );
});
