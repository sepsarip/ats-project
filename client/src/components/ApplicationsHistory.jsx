import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import { getMyApplications } from '../services/applications';
import { formatSalaryRange } from '../utils/formatters';

function titleCase(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function statusClass(status) {
  if (!status) return 'bg-primary text-white';
  const m = status.toLowerCase();
  if (m === 'applied') return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  if (m === 'interview') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (m === 'rejected') return 'bg-red-100 text-red-700 border-red-200';
  if (m === 'offered') return 'bg-amber-100 text-amber-700 border-amber-200';
  if (m === 'hired')
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return 'bg-primary text-white';
}

export default function ApplicationsHistory({ defaultLimit = 10 }) {
  const [page, setPage] = useState(1);
  const [limit] = useState(defaultLimit);
  const [apps, setApps] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: opts.page ?? page, limit };
        const data = await getMyApplications(params);
        setApps(data.applications || []);
        setMeta(data.meta || {});
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load applications',
        );
      } finally {
        setLoading(false);
      }
    },
    [page, limit],
  );

  useEffect(() => {
    load({ page });
  }, [load, page]);

  if (loading) return <div className="text-text-secondary">Memuat...</div>;

  if (error) return <div className="text-error">{error}</div>;

  if (!loading && apps.length === 0)
    return <div className="text-text-secondary">Belum ada lamaran</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-text-secondary">Total: {meta.total || 0}</div>
      </div>

      <div className="flex flex-col space-y-4">
        {apps.map((a) => (
          <article
            key={a.id}
            className="border border-border bg-surface p-4 rounded"
          >
            <header className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">
                {a.job?.title}
              </h3>
              {a.status && (
                <span
                  className={`ml-2 text-sm font-medium px-2 py-1 rounded-md ${statusClass(a.status)}`}
                >
                  {titleCase(a.status)}
                </span>
              )}
            </header>

            <div className="mt-3 flex flex-wrap gap-2 text-sm text-text-primary">
              {a.job?.location && (
                <span className="px-2 py-1 bg-sidebar rounded text-text-primary">
                  {a.job.location}
                </span>
              )}
              {a.job?.employment_type && (
                <span className="px-2 py-1 bg-sidebar rounded text-text-primary">
                  {a.job.employment_type}
                </span>
              )}
            </div>

            <div className="mt-3 text-sm text-text-secondary flex items-center justify-between">
              <div>
                {formatSalaryRange(a.job?.min_salary, a.job?.max_salary)}
              </div>
              <div className="text-sm text-text-secondary">
                {new Date(a.applied_at).toLocaleString('id-ID')}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Link
                to={`/jobs/${a.job?.id}`}
                className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded-md text-sm"
              >
                Lihat Detail
              </Link>
            </div>
          </article>
        ))}
      </div>

      <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
    </div>
  );
}
