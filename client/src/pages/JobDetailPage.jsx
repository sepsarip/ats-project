import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobDetail } from '../services/api';
import { formatSalaryRange } from '../utils/formatters';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplyConfirmModal from '../components/ApplyConfirmModal';

function Section({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-4">
      <h4 className="text-sm font-semibold text-text-primary mb-2">{title}</h4>
      <ul className="list-disc pl-5 text-text-secondary">
        {items.map((it, i) => (
          <li key={i} className="mb-1">
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const j = await fetchJobDetail(id);
        if (!mounted) return;
        if (!j) {
          setError('Lowongan tidak ditemukan');
          setJob(null);
        } else {
          setJob(j);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Gagal mengambil data',
        );
        setJob(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="p-6 flex-1">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-text-secondary hover:underline"
            >
              &#8592; Kembali
            </button>
          </div>

          <div className="bg-surface border border-border rounded shadow-sm p-6">
            {loading && <div className="text-text-secondary">Memuat...</div>}
            {error && (
              <div className="bg-error/10 border border-error/20 text-error p-4 rounded">
                <div>{error}</div>
              </div>
            )}

            {!loading && !error && !job && (
              <div className="text-text-secondary">
                Lowongan tidak ditemukan.
              </div>
            )}

            {!loading && job && (
              <article>
                <header className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                      {job.title}
                    </h1>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-text-primary">
                      {job.location && (
                        <span className="px-2 py-1 bg-sidebar rounded text-text-primary">
                          {job.location}
                        </span>
                      )}
                      {job.employment_type && (
                        <span className="px-2 py-1 bg-sidebar rounded text-text-primary">
                          {job.employment_type}
                        </span>
                      )}
                      {(job.min_salary || job.max_salary) && (
                        <span className="px-2 py-1 bg-sidebar rounded text-text-primary">
                          {formatSalaryRange(job.min_salary, job.max_salary)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={job.status !== 'open'}
                      onClick={() => setApplyOpen(true)}
                      className={
                        job.status === 'open'
                          ? 'px-3 py-1 rounded-md text-sm bg-primary hover:bg-primary-hover text-white'
                          : 'px-3 py-1 rounded-md text-sm bg-sidebar text-text-secondary opacity-60 cursor-not-allowed'
                      }
                      aria-disabled={job.status !== 'open'}
                    >
                      Apply Now
                    </button>
                  </div>
                </header>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="md:col-span-2">
                    <section className="mb-4">
                      <h4 className="text-sm font-semibold text-text-primary mb-2">
                        About the Job
                      </h4>
                      <p className="text-text-secondary">{job.about}</p>
                    </section>
                    <Section
                      title="Job Requirements"
                      items={job.requirements}
                    />
                    <Section title="Job Description" items={job.descriptions} />
                    <Section
                      title="Additional Info"
                      items={job.additional_info}
                    />
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <ApplyConfirmModal
        open={applyOpen}
        job={job}
        jobId={id}
        onClose={() => setApplyOpen(false)}
      />
    </div>
  );
}
