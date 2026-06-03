import React, { useEffect, useMemo, useState } from 'react';
import { fetchDashboardStats } from '../../services/dashboard';

export default function HomeDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
              'Gagal memuat statistik dashboard. Coba lagi nanti.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const jobsItems = useMemo(
    () => [
      { label: 'Total Jobs', value: stats?.total_jobs },
      { label: 'Draft', value: stats?.total_jobs_draft },
      { label: 'Open', value: stats?.total_jobs_open },
      { label: 'Closed', value: stats?.total_jobs_closed },
    ],
    [stats],
  );

  const applicationItems = useMemo(
    () => [
      { label: 'Applied', value: stats?.total_applied },
      { label: 'Interview', value: stats?.total_interview },
      { label: 'Offered', value: stats?.total_offered },
      { label: 'Hired', value: stats?.total_hired },
      { label: 'Rejected', value: stats?.total_rejected },
    ],
    [stats],
  );

  function StatCard({ label, value }) {
    const display = Number.isFinite(value) ? value : 0;
    return (
      <div className="p-4 bg-surface rounded border border-border">
        <div className="text-sm text-text-secondary">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-text-primary">
          {display}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-surface rounded border border-border">
        <h2 className="text-lg font-semibold text-text-primary">Beranda</h2>
        <p className="text-sm text-text-secondary">
          Ringkasan statistik lowongan dan pelamaran.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded text-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-4 bg-surface rounded border border-border text-text-secondary">
          Memuat statistik...
        </div>
      ) : (
        <>
          <div className="p-4 bg-surface rounded border border-border">
            <h3 className="text-base font-semibold text-text-primary mb-3">
              Jobs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
              {jobsItems.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>

          <div className="p-4 bg-surface rounded border border-border">
            <h3 className="text-base font-semibold text-text-primary mb-3">
              Candidate Applications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-center">
              {applicationItems.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
