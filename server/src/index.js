import express from 'express';
import { env } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.route.js';
import adminUsersRoutes from './routes/admin.users.route.js';
import jobsRoutes from './routes/jobs.route.js';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/error.middleware.js';

const app = express();

app.use(express.json({ limit: '1mb' }));

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/jobs', jobsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`ATS server listening on port ${env.port}`);
});
