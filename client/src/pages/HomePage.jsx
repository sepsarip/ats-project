import React, { useEffect, useState, useCallback } from 'react';
import { fetchJobs } from '../services/api';
import JobCard from '../components/JobCard';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomePage() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    employment_type: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: opts.page ?? page, limit, ...filters };
        const data = await fetchJobs(params);
        setJobs(data.jobs || []);
        setMeta(data.meta || {});
      } catch (err) {
        setError(err?.message || 'Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    },
    [filters, page, limit],
  );

  useEffect(() => {
    load({ page });
  }, [load, page]);

  function handleSearch() {
    setPage(1);
    setFilters(appliedFilters);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="p-6 pb-16 flex-1">
        <div className="mx-auto max-w-6xl">
          <section className="mb-6 p-6 bg-white rounded shadow-sm border border-zinc-200">
            <h1 className="text-2xl font-bold text-text-primary">
              Join with our team at PT. XYZ
            </h1>
            <p className="mt-2 text-text-secondary">
              We are looking for the best talents to build the future together.
            </p>
            <p className="mt-2 text-text-secondary">
              Find the right vacancies that match your skills and interests.
            </p>

            <div className="mt-4">
              <Filters
                filters={appliedFilters}
                onChange={setAppliedFilters}
                onSearch={handleSearch}
              />
            </div>
          </section>

          <section>
            {loading && <div className="text-text-secondary">Loading...</div>}
            {error && (
              <div className="bg-error/10 border border-error/20 text-error p-4 rounded">
                <div>{error}</div>
                <button
                  onClick={() => load({ page })}
                  className="mt-2 px-3 py-1 bg-error text-white rounded"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div className="text-text-secondary">
                No vacancies found. Try changing the keyword or filter.
              </div>
            )}

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
            <Pagination meta={meta} onPageChange={(p) => setPage(p)} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
