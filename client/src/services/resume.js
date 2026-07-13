import api from './api';

export async function uploadMyResume(file) {
  const fd = new FormData();
  fd.append('resume', file);

  const res = await api.post('/api/profiles/resume', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data?.data?.resume || null;
}

export async function deleteMyResume() {
  const res = await api.delete('/api/profiles/resume');
  return res.data || null;
}

export default { uploadMyResume, deleteMyResume };
