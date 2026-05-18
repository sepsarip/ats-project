import api from './api';

export async function login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  // return parsed data or throw
  return res.data?.data;
}

export async function register(fullName, email, password) {
  const res = await api.post('/api/auth/register', {
    fullName,
    email,
    password,
  });
  return res.data?.data;
}

export function extractAuthFromResponse(data) {
  // expect data: { user, token }
  return {
    user: data?.user || null,
    token: data?.token?.accessToken || null,
  };
}

export default { login, extractAuthFromResponse, register };
