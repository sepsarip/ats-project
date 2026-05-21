import api from './api';

export async function getMyApplications(params = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  );

  const res = await api.get('/api/applications/me', { params: cleaned });
  return res.data?.data || { applications: [], meta: {} };
}

export async function applyToJob(jobId) {
  if (!jobId) throw new Error('jobId is required');
  const res = await api.post(`/api/jobs/${jobId}/apply`);
  return res.data?.data?.application || null;
}

export default { getMyApplications, applyToJob };
