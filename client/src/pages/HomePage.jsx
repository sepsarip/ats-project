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
      <main className="p-6 flex-1">
        <div className="mx-auto max-w-6xl">
          <section className="mb-6 p-6 bg-white rounded shadow-sm border border-zinc-200">
            <h1 className="text-2xl font-bold text-text-primary">
              Bergabunglah dengan Tim Kami di PT. Kami Hire Kamu
            </h1>
            <p className="mt-2 text-text-secondary">
              Kami mencari talenta terbaik untuk membangun masa depan bersama.
            </p>
            <p className="mt-2 text-text-secondary">
              Temukan lowongan yang sesuai dengan skill dan minatmu.
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
            {loading && <div className="text-text-secondary">Memuat...</div>}
            {error && (
              <div className="bg-error/10 border border-error/20 text-error p-4 rounded">
                <div>{error}</div>
                <button
                  onClick={() => load({ page })}
                  className="mt-2 px-3 py-1 bg-error text-white rounded"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div className="text-text-secondary">
                Tidak ada lowongan ditemukan. Coba ubah kata kunci atau filter.
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
