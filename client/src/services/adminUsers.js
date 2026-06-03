import api from './api';

export async function createHrUser(payload) {
  const res = await api.post('/api/admin/users/hr', payload);
  return res.data?.data?.user || null;
}

export default { createHrUser };
