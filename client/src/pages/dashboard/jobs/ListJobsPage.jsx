import React, { useEffect, useState, useCallback } from 'react';
import { fetchJobs } from '../../../services/api';
import { deleteJob } from '../../../services/jobs';
import { Link, useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../../utils/formatters';
import Filters from '../../../components/Filters';
import Pagination from '../../../components/Pagination';

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
            className="px-3 py-2 bg-success hover:bg-emerald-700 text-white rounded"
          >
            Create New Job
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

          {/* Desktop / tablet: table */}
          <table className="w-full table-auto hidden sm:table">
            <thead>
              <tr className="text-justify-start bg-sidebar">
                <th className="px-2 py-1">No</th>
                <th className="px-2 py-1">Job Title</th>
                <th className="px-2 py-1">Location</th>
                <th className="px-2 py-1">Employment</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Min Salary</th>
                <th className="px-2 py-1">Max Salary</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j, index) => (
                <tr key={j.id} className="border-t">
                  <td className="px-2 py-2">{offset + index + 1}</td>
                  <td className="px-2 py-2">{j.title}</td>
                  <td className="px-2 py-2">{j.location}</td>
                  <td className="px-2 py-2">{j.employment_type}</td>
                  <td className="px-2 py-2">{j.status}</td>
                  <td className="px-2 py-2">
                    {j.min_salary ? formatRupiah(j.min_salary) : '-'}
                  </td>
                  <td className="px-2 py-2">
                    {j.max_salary ? formatRupiah(j.max_salary) : '-'}
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/candidates/jobs/${j.id}`}
                        className="px-2 py-1 bg-zinc-700 text-white rounded"
                      >
                        Candidates
                      </Link>
                      <Link
                        to={`${j.id}`}
                        className="px-2 py-1 bg-primary text-white rounded"
                      >
                        Detail
                      </Link>
                      <button
                        onClick={() => navigate(`${j.id}/edit`)}
                        className="px-2 py-1 bg-warning text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(j.id)}
                        className="px-2 py-1 bg-error text-white rounded"
                      >
                        Delete
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
        </>
      )}
    </div>
  );
}
