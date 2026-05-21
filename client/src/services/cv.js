import api from './api';

export async function uploadMyCv(file) {
  const fd = new FormData();
  fd.append('cv', file);

  const res = await api.post('/api/profiles/cv', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data?.data?.cv || null;
}

export async function deleteMyCv() {
  const res = await api.delete('/api/profiles/cv');
  return res.data || null;
}

export default { uploadMyCv, deleteMyCv };
