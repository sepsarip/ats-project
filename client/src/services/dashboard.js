import api from './api';

export async function fetchDashboardStats() {
  const res = await api.get('/api/dashboard/stats');
  return (
    res.data?.data || {
      total_jobs: 0,
      total_jobs_draft: 0,
      total_jobs_open: 0,
      total_jobs_closed: 0,
      total_applied: 0,
      total_interview: 0,
      total_offered: 0,
      total_hired: 0,
      total_rejected: 0,
    }
  );
}

export default { fetchDashboardStats };
