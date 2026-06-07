import api from './api';
import { cleanParams } from './utils';

export async function getMyApplications(params = {}) {
  const res = await api.get('/api/applications/me', {
    params: cleanParams(params),
  });
  return res.data?.data || { applications: [], meta: {} };
}

export async function updateApplicationStatus(applicationId, status) {
  if (!applicationId) throw new Error('applicationId is required');
  if (!status) throw new Error('status is required');

  const res = await api.patch(`/api/applications/${applicationId}/status`, {
    status,
  });

  return res.data?.data?.application || null;
}

export async function applyToJob(jobId) {
  if (!jobId) throw new Error('jobId is required');
  const res = await api.post(`/api/jobs/${jobId}/apply`);
  return res.data?.data?.application || null;
}

export default { getMyApplications, applyToJob, updateApplicationStatus };
