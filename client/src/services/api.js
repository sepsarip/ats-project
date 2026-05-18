import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

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

// Auth helpers: keep concerns separated and reusable
export function setAuthHeader(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export default api;
