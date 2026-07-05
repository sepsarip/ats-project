import api from './api';
import { cleanParams, getFilenameFromContentDisposition } from './utils';

export async function fetchJobCandidates(jobId, params = {}) {
  if (!jobId) throw new Error('jobId is required');
  const res = await api.get(`/api/jobs/${jobId}/candidates`, {
    params: cleanParams(params),
  });
  return res.data?.data || { job: null, candidates: [], meta: {} };
}

export async function fetchJobCandidateDetail(jobId, userId) {
  if (!jobId) throw new Error('jobId is required');
  if (!userId) throw new Error('userId is required');
  const res = await api.get(`/api/jobs/${jobId}/candidates/${userId}`);
  return res.data?.data || null;
}

export async function downloadCandidateResume(jobId, userId) {
  if (!jobId) throw new Error('jobId is required');
  if (!userId) throw new Error('userId is required');

  const res = await api.get(
    `/api/jobs/${jobId}/candidates/${userId}/cv/download`,
    {
      responseType: 'blob',
    },
  );

  const disposition =
    res.headers?.['content-disposition'] ||
    res.headers?.['Content-Disposition'];
  const filename =
    getFilenameFromContentDisposition(disposition) || `resume_${userId}`;

  return { blob: res.data, filename };
}

export default {
  fetchJobCandidates,
  fetchJobCandidateDetail,
  downloadCandidateResume,
};
