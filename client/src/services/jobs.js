import api from './api';

export async function createJob(payload) {
  const res = await api.post('/api/jobs', payload);
  return res.data?.data?.job || null;
}

export async function updateJob(id, payload) {
  const res = await api.put(`/api/jobs/${id}`, payload);
  return res.data?.data?.job || null;
}

export async function deleteJob(id) {
  const res = await api.delete(`/api/jobs/${id}`);
  return res.data || null;
}

export default { createJob, updateJob, deleteJob };
