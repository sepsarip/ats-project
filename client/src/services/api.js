import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Fetch list of jobs with optional filters
export async function fetchJobs(params = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== '',
    ),
  );

  const res = await api.get('/api/jobs', { params: cleaned });
  // return data.jobs and meta only
  return res.data?.data || { jobs: [], meta: {} };
}

// Fetch single job detail by ID
export async function fetchJobDetail(id) {
  if (!id) return null;
  const res = await api.get(`/api/jobs/${id}`);
  return res.data?.data?.job || null;
}

// Auth helpers: keep concerns separated and reusable
export function setAuthHeader(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export default api;
