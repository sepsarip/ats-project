import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJobDetail } from '../../../services/api';
import { deleteJob } from '../../../services/jobs';
import { formatSalaryRange, formatLongDate } from '../../../utils/formatters';
import { FiUsers, FiEdit, FiTrash2, FiMapPin, FiBriefcase } from 'react-icons/fi';
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

export default function JobDetailAdminPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const j = await fetchJobDetail(id);
      setJob(j);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete job?')) return;
    await deleteJob(id);
    navigate('/dashboard/jobs');
  }

  if (loading) return <div className="text-text-secondary p-4">Loading…</div>;
  if (!job) return <div className="text-text-secondary p-4">Job not found.</div>;

  return (
    <div className="p-6 bg-surface border border-border rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-6 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-text-primary leading-tight">
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
              <span>{formatSalaryRange(job.min_salary, job.max_salary)}</span>
            </span>
            <span className="inline-flex items-center">
              {job.status === 'open' && (
                <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold uppercase tracking-wider">
                  Open
                </span>
              )}
              {job.status === 'draft' && (
                <span className="px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold uppercase tracking-wider">
                  Draft
                </span>
              )}
              {job.status === 'closed' && (
                <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-semibold uppercase tracking-wider">
                  Closed
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-2 items-center">
          <Link
            to={`/dashboard/candidates/jobs/${id}`}
            title="Candidates"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-700 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <FiUsers className="w-4 h-4" />
            <span>Candidates</span>
          </Link>
          <Link
            to={`edit`}
            title="Edit Job"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-warning hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <FiEdit className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            title="Delete Job"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-error hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {job.about && (
          <section className="bg-zinc-50/50 p-5 rounded-lg border border-border/60">
            <h4 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
              <div className="w-1.5 h-4 bg-primary rounded-full"></div>
              About the Job
            </h4>
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{job.about}</p>
          </section>
        )}

        <Section title="Job Description" items={job.descriptions} />
        <Section title="Job Requirements" items={job.requirements} />
        <Section title="Additional Info" items={job.additional_info} />
      </div>

      <div className="mt-6 pt-6 border-t border-border/60 text-xs text-text-secondary grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-50/30 p-4 rounded-lg">
        <div><span className="font-semibold">Posted by:</span> {job.posted_by_name || job.posted_by || '—'}</div>
        <div><span className="font-semibold">Job ID:</span> {job.id}</div>
        <div>
          <span className="font-semibold">Created at:</span> {job.created_at ? formatLongDate(job.created_at) : '—'}
        </div>
        <div>
          <span className="font-semibold">Updated at:</span> {job.updated_at ? formatLongDate(job.updated_at) : '—'}
        </div>
      </div>
    </div>
  );
}
