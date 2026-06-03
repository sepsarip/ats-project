import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import HomeDashboard from './HomeDashboard';
import PrivateRoute from '../../components/PrivateRoute';
import JobsListPage from './jobs/ListJobsPage';
import JobCreatePage from './jobs/CreateJobPage';
import JobDetailAdminPage from './jobs/JobDetailAdminPage';
import JobEditPage from './jobs/EditJobPage';
import CandidatesLandingPage from './candidates/CandidatesLandingPage';
import JobCandidatesPage from './candidates/JobCandidatesPage';
import CandidateDetailPage from './candidates/CandidateDetailPage';
import CreateHrAccountPage from './hr/CreateHrAccountPage';

export default function DashboardRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<HomeDashboard />} />
        <Route path="/" element={<HomeDashboard />} />
        <Route path="jobs" element={<JobsListPage />} />
        <Route path="jobs/create" element={<JobCreatePage />} />
        <Route path="jobs/:id" element={<JobDetailAdminPage />} />
        <Route path="jobs/:id/edit" element={<JobEditPage />} />

        <Route path="candidates" element={<CandidatesLandingPage />} />
        <Route path="candidates/jobs/:jobId" element={<JobCandidatesPage />} />
        <Route
          path="candidates/jobs/:jobId/users/:userId"
          element={<CandidateDetailPage />}
        />

        <Route
          path="hr/create"
          element={
            <PrivateRoute requiredRole="admin">
              <CreateHrAccountPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </DashboardLayout>
  );
}
