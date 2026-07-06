import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobDetail } from '../services/api';
import { formatSalaryRange } from '../utils/formatters';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplyConfirmModal from '../components/ApplyConfirmModal';
import { FiArrowLeft, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { PiMoney } from 'react-icons/pi';

function Section({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="bg-zinc-50/50 p-5 rounded-lg border border-border/60 mt-4">
      <h4 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
        <div className="w-1.5 h-4 bg-primary rounded-full"></div>
        {title}
      </h4>
      <ul className="list-disc pl-5 text-text-secondary text-sm space-y-1.5 leading-relaxed">
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
      <main className="p-6 pb-16 flex-1">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary font-medium transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          <div className="bg-surface border border-border rounded-xl shadow-sm p-6 sm:p-8">
            {loading && <div className="text-text-secondary">Loading...</div>}
            {error && (
              <div className="bg-error/10 border border-error/20 text-error p-4 rounded-lg">
                <div>{error}</div>
              </div>
            )}

            {!loading && !error && !job && (
              <div className="text-text-secondary">
                Job not found.
              </div>
            )}

            {!loading && job && (
              <article>
                <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-extrabold text-text-primary leading-tight">
                      {job.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-2.5 text-sm text-text-primary">
                      {job.location && (
                        <span className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                          <FiMapPin className="w-4 h-4 text-zinc-500" />
                          <span>{job.location}</span>
                        </span>
                      )}
                      {job.employment_type && (
                        <span className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                          <FiBriefcase className="w-4 h-4 text-zinc-500" />
                          <span>{job.employment_type}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full text-text-secondary shadow-sm">
                        <PiMoney className="w-4 h-4 text-zinc-500" />
                        <span>{formatSalaryRange(job.min_salary, job.max_salary) || 'Negotiable'}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    <button
                      type="button"
                      disabled={job.status !== 'open'}
                      onClick={() => setApplyOpen(true)}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all hover:scale-105 duration-200 ${job.status === 'open'
                        ? 'bg-primary hover:bg-primary-hover text-white'
                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed opacity-60'
                        }`}
                      aria-disabled={job.status !== 'open'}
                    >
                      Apply Now
                    </button>
                  </div>
                </header>

                <div className="mt-6 space-y-4">
                  <section className="bg-zinc-50/50 p-5 rounded-lg border border-border/60">
                    <h4 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                      About the Job
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{job.about}</p>
                  </section>

                  <Section title="Job Description" items={job.descriptions} />
                  <Section
                    title="Job Requirements"
                    items={job.requirements}
                  />
                  <Section
                    title="Additional Info"
                    items={job.additional_info}
                  />
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
