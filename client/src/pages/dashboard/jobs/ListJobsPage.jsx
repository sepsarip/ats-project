import React, { useEffect, useState, useCallback } from 'react';
import { fetchJobs } from '../../../services/api';
import { deleteJob } from '../../../services/jobs';
import { Link, useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../../utils/formatters';
import Filters from '../../../components/Filters';
import Pagination from '../../../components/Pagination';
import { FiUsers, FiEye, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

export default function JobsListPage() {
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    location: '',
    employment_type: '',
    status: '',
    limit: 10,
  });

  const [filters, setFilters] = useState(appliedFilters);
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(
    async (opts = {}) => {
      setLoading(true);
      try {
        const params = {
          page: opts.page ?? page,
          limit: filters.limit ?? appliedFilters.limit,
          search: filters.search,
          location: filters.location,
          employment_type: filters.employment_type,
          status: filters.status,
        };
        const data = await fetchJobs(params);
        setJobs(data.jobs || []);
        setMeta(data.meta || {});
        return data;
      } finally {
        setLoading(false);
      }
    },
    [page, filters, appliedFilters.limit],
  );

  useEffect(() => {
    load({ page });
  }, [load, page]);

  function handleSearch() {
    setPage(1);
    setFilters(appliedFilters);
  }

  async function handleDelete(id) {
    if (!confirm('Delete job?')) return;
    try {
      await deleteJob(id);
      // reload list; if page becomes empty, move back one page
      const data = await load({ page });
      if ((data?.jobs?.length || 0) === 0 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch (err) {
      console.error('delete failed', err);
    }
  }

  const currentLimit = filters.limit ?? meta.limit ?? appliedFilters.limit;
  const offset = ((meta.page || page) - 1) * (currentLimit || 0);

  return (
    <div className="p-4 bg-surface rounded border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Job Management</h2>
        <div>
          <Link
            to="create"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-success hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all duration-200"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create New Job</span>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <Filters
          filters={appliedFilters}
          onChange={setAppliedFilters}
          onSearch={handleSearch}
          showStatus
          showLimit
        />
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <>
          {/* Mobile: list of cards */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {jobs.map((j, index) => (
              <article
                key={j.id}
                className="border border-border bg-surface p-3 rounded"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold">{j.title}</h3>
                    <div className="mt-2 text-sm text-text-primary flex flex-wrap gap-2">
                      {j.location && (
                        <span className="px-2 py-1 bg-sidebar rounded">
                          {j.location}
                        </span>
                      )}
                      {j.employment_type && (
                        <span className="px-2 py-1 bg-sidebar rounded">
                          {j.employment_type}
                        </span>
                      )}
                    </div>
                  </div>
                  {j.status && (
                    <span
                      className={`ml-2 text-sm font-medium px-2 py-1 rounded text-white ${j.status === 'open' ? 'bg-success' : j.status === 'draft' ? 'bg-warning' : 'bg-error'}`}
                    >
                      {j.status}
                    </span>
                  )}
                </div>

                <div className="mt-3 text-sm text-text-secondary">
                  <div>
                    <strong>Salary:</strong>{' '}
                    {j.min_salary || j.max_salary
                      ? `${j.min_salary ? formatRupiah(j.min_salary) : '-'} - ${j.max_salary ? formatRupiah(j.max_salary) : '-'}`
                      : '-'}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`${j.id}`}
                    className="px-3 py-1 bg-primary text-white rounded text-sm"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => navigate(`${j.id}/edit`)}
                    className="px-3 py-1 bg-warning text-white rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(j.id)}
                    className="px-3 py-1 bg-error text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="w-full overflow-x-auto hidden sm:block border border-border rounded-lg">
            <table className="w-full min-w-[900px] table-fixed border-collapse">
              <thead>
                <tr className="text-left bg-sidebar">
                  <th className="px-3 py-3 w-12 text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">No</th>
                  <th className="px-3 py-3 w-[22%] text-xs font-semibold text-text-secondary uppercase tracking-wider">Job Title</th>
                  <th className="px-3 py-3 w-[12%] text-xs font-semibold text-text-secondary uppercase tracking-wider">Location</th>
                  <th className="px-3 py-3 w-[12%] text-xs font-semibold text-text-secondary uppercase tracking-wider">Employment</th>
                  <th className="px-3 py-3 w-[10%] text-center text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 w-[12%] text-xs font-semibold text-text-secondary uppercase tracking-wider">Min Salary</th>
                  <th className="px-3 py-3 w-[12%] text-xs font-semibold text-text-secondary uppercase tracking-wider">Max Salary</th>
                  <th className="px-3 py-3 w-[20%] text-xs font-semibold text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j, index) => (
                  <tr key={j.id} className="border-t border-border hover:bg-zinc-50/50 transition-colors">
                    <td className="px-3 py-3 text-center text-sm text-text-secondary">{offset + index + 1}</td>
                    <td className="px-3 py-3 text-sm font-medium text-text-primary">{j.title}</td>
                    <td className="px-3 py-3 text-sm text-text-secondary">{j.location}</td>
                    <td className="px-3 py-3 text-sm text-text-secondary">{j.employment_type}</td>
                    <td className="px-3 py-3 text-center text-sm">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full text-white ${j.status === 'open' ? 'bg-success' : j.status === 'draft' ? 'bg-warning' : 'bg-error'
                        }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-text-secondary">
                      {j.min_salary != null ? formatRupiah(j.min_salary) : 'Belum ditentukan'}
                    </td>
                    <td className="px-3 py-3 text-sm text-text-secondary">
                      {j.max_salary != null ? formatRupiah(j.max_salary) : 'Belum ditentukan'}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/candidates/jobs/${j.id}`}
                          title="Candidates"
                          className="inline-flex items-center justify-center w-8 h-8 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
                        >
                          <FiUsers className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`${j.id}`}
                          title="Detail"
                          className="inline-flex items-center justify-center w-8 h-8 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => navigate(`${j.id}/edit`)}
                          title="Edit"
                          className="inline-flex items-center justify-center w-8 h-8 rounded bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(j.id)}
                          title="Delete"
                          className="inline-flex items-center justify-center w-8 h-8 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
          </div>
        </>
      )}
    </div>
  );
}
