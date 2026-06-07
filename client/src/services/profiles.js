import api from './api';

export async function getMyProfile() {
  const res = await api.get('/api/profiles/me');
  return res.data?.data || null;
}

export async function updateMyProfile(payload) {
  const res = await api.put('/api/profiles/me', payload);
  return res.data?.data || null;
}

export default { getMyProfile, updateMyProfile };
