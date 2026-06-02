import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CandidateFilters from '../../../components/CandidateFilters';
import Pagination from '../../../components/Pagination';
import {
  fetchJobCandidates,
  downloadCandidateCv,
} from '../../../services/candidates';
import { updateApplicationStatus } from '../../../services/applications';
import { APPLICATION_STATUSES } from '../../../constants/applicationStatuses';
import { formatShortDate } from '../../../utils/formatters';
import { triggerDownload } from '../../../utils/download';

export default function JobCandidatesPage() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    status: '',
    gender: '',
    city: '',
    province: '',
    limit: 10,
  });
  const [filters, setFilters] = useState(appliedFilters);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [downloadingUserId, setDownloadingUserId] = useState(null);
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);
  const [statusDrafts, setStatusDrafts] = useState({});

  const load = useCallback(
    async (opts = {}) => {
      if (!jobId) return;
      setLoading(true);
      setError('');
      try {
        const params = {
          page: opts.page ?? page,
          limit: filters.limit ?? appliedFilters.limit,
          status: filters.status,
          gender: filters.gender,
          city: filters.city,
          province: filters.province,
        };
        const data = await fetchJobCandidates(jobId, params);
        setJob(data.job || null);
        setCandidates(data.candidates || []);
        setMeta(data.meta || {});

        const nextDrafts = {};
        for (const c of data.candidates || []) {
          nextDrafts[c.application_id] = c.status;
        }
        setStatusDrafts(nextDrafts);

        return data;
      } catch (e) {
        console.error('Failed to load candidates', e);
        setError('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    },
    [jobId, page, filters, appliedFilters.limit],
  );

  useEffect(() => {
    load({ page });
  }, [load, page]);

  function handleApplyFilters() {
    setPage(1);
    setFilters(appliedFilters);
  }

  const currentLimit = filters.limit ?? meta.limit ?? appliedFilters.limit;
  const offset = ((meta.page || page) - 1) * (currentLimit || 0);

  const filteredCandidates = useMemo(() => {
    const term = (search || '').trim().toLowerCase();
    if (!term) return candidates;

    return (candidates || []).filter((c) => {
      const name = c?.user?.full_name || '';
      const email = c?.user?.email || '';
      return (
        String(name).toLowerCase().includes(term) ||
        String(email).toLowerCase().includes(term)
      );
    });
  }, [candidates, search]);

  async function handleDownloadCv(userId) {
    setDownloadingUserId(userId);
    try {
      const { blob, filename } = await downloadCandidateCv(jobId, userId);
      triggerDownload(blob, filename);
    } catch (e) {
      console.error('Download CV failed', e);
      alert('Download CV failed');
    } finally {
      setDownloadingUserId(null);
    }
  }

  async function handleUpdateStatus(applicationId) {
    const nextStatus = statusDrafts[applicationId];
    if (!nextStatus) return;

    setUpdatingApplicationId(applicationId);
    try {
      const updated = await updateApplicationStatus(applicationId, nextStatus);
      if (updated?.status) {
        setCandidates((prev) =>
          (prev || []).map((c) =>
            c.application_id === applicationId
              ? { ...c, status: updated.status }
              : c,
          ),
        );
      }
    } catch (e) {
      console.error('Update status failed', e);
      alert('Update status failed');
    } finally {
      setUpdatingApplicationId(null);
    }
  }

  return (
    <div className="p-4 bg-surface rounded border border-border">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Candidates</h2>
          <div className="text-sm text-text-secondary">
            {job?.title ? (
              <>
                {job.title} (Job ID: {job.id})
              </>
            ) : (
              <>Job ID: {jobId}</>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <CandidateFilters
          filters={appliedFilters}
          onChange={setAppliedFilters}
          onApply={handleApplyFilters}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-error">{error}</p>
      ) : candidates.length === 0 ? (
        <p>No candidates found.</p>
      ) : (
        <>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-justify-start bg-sidebar">
                <th className="px-2 py-1">No</th>
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Score CV</th>
                <th className="px-2 py-1">Applied At</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((c, index) => (
                <tr key={c.application_id} className="border-t">
                  <td className="px-2 py-2">{offset + index + 1}</td>
                  <td className="px-2 py-2">{c.user?.full_name || '-'}</td>
                  <td className="px-2 py-2">{c.status || '-'}</td>
                  <td className="px-2 py-2">
                    {c.score === null || c.score === undefined ? '-' : c.score}
                  </td>
                  <td className="px-2 py-2">
                    {c.applied_at ? formatShortDate(c.applied_at) : '-'}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`users/${c.user?.id}`}
                        className="px-2 py-1 bg-primary text-white rounded"
                      >
                        Detail
                      </Link>

                      <button
                        onClick={() => handleDownloadCv(c.user?.id)}
                        disabled={
                          !c.user?.id || downloadingUserId === c.user?.id
                        }
                        className="px-2 py-1 border border-border hover:bg-sidebar disabled:opacity-50"
                      >
                        {downloadingUserId === c.user?.id
                          ? 'Downloading…'
                          : 'Download CV'}
                      </button>

                      <select
                        value={statusDrafts[c.application_id] || ''}
                        onChange={(e) =>
                          setStatusDrafts((prev) => ({
                            ...prev,
                            [c.application_id]: e.target.value,
                          }))
                        }
                        className="px-2 py-1 border border-border hover:bg-sidebar rounded bg-surface text-text-primary cursor-pointer"
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleUpdateStatus(c.application_id)}
                        disabled={updatingApplicationId === c.application_id}
                        className="px-2 py-1 bg-warning text-white rounded disabled:opacity-50"
                      >
                        {updatingApplicationId === c.application_id
                          ? 'Updating…'
                          : 'Update'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
          </div>

          {search && filteredCandidates.length === 0 && (
            <p className="mt-3 text-sm text-text-secondary">
              Tidak ada hasil untuk pencarian di page ini.
            </p>
          )}
        </>
      )}
    </div>
  );
}
