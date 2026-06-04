import React, { useEffect, useMemo, useState } from 'react';
import { fetchDashboardStats } from '../../services/dashboard';
import {
  FiBriefcase,
  FiFileText,
  FiLock,
  FiInbox,
  FiMessageSquare,
  FiAward,
  FiUserCheck,
  FiXCircle,
} from 'react-icons/fi';

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
      { label: 'Total Jobs', value: stats?.total_jobs, icon: FiBriefcase, color: 'text-blue-500 bg-blue-50' },
      { label: 'Draft', value: stats?.total_jobs_draft, icon: FiFileText, color: 'text-zinc-500 bg-zinc-50' },
      { label: 'Open', value: stats?.total_jobs_open, icon: FiBriefcase, color: 'text-emerald-500 bg-emerald-50' },
      { label: 'Closed', value: stats?.total_jobs_closed, icon: FiLock, color: 'text-red-500 bg-red-50' },
    ],
    [stats],
  );

  const applicationItems = useMemo(
    () => [
      { label: 'Applied', value: stats?.total_applied, icon: FiInbox, color: 'text-indigo-500 bg-indigo-50' },
      { label: 'Interview', value: stats?.total_interview, icon: FiMessageSquare, color: 'text-amber-500 bg-amber-50' },
      { label: 'Offered', value: stats?.total_offered, icon: FiAward, color: 'text-teal-500 bg-teal-50' },
      { label: 'Hired', value: stats?.total_hired, icon: FiUserCheck, color: 'text-emerald-500 bg-emerald-50' },
      { label: 'Rejected', value: stats?.total_rejected, icon: FiXCircle, color: 'text-red-500 bg-red-50' },
    ],
    [stats],
  );

  function StatCard({ label, value, icon: Icon, colorClass }) {
    const display = Number.isFinite(value) ? value : 0;
    return (
      <div className="p-5 bg-surface rounded-lg border border-border flex items-center justify-between hover:shadow-sm transition-all duration-200">
        <div className="text-left">
          <div className="text-sm font-medium text-text-secondary">{label}</div>
          <div className="mt-1 text-3xl font-bold text-text-primary">
            {display}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClass || 'bg-sidebar text-text-secondary'}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {jobsItems.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                  colorClass={item.color}
                />
              ))}
            </div>
          </div>

          <div className="p-4 bg-surface rounded border border-border">
            <h3 className="text-base font-semibold text-text-primary mb-3">
              Candidate Applications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {applicationItems.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                  colorClass={item.color}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
