import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJobDetail } from '../../../services/api';
import { deleteJob } from '../../../services/jobs';
import { formatSalaryRange, formatLongDate } from '../../../utils/formatters';

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

  if (loading) return <p>Loading…</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="p-4 bg-surface rounded border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{job.title}</h2>
        <div className="flex gap-2">
          <Link
            to={`/dashboard/candidates/jobs/${id}`}
            className="px-2 py-1 bg-zinc-700 text-white rounded"
          >
            Candidates
          </Link>
          <Link to={`edit`} className="px-2 py-1 bg-primary text-white rounded">
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-error text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <span className="text-sm text-text-secondary">
          {job.employment_type || '—'}
        </span>
        <span className="text-sm text-text-secondary">
          {job.location || '—'}
        </span>
        <span className="text-sm text-text-secondary">
          {formatSalaryRange(job.min_salary, job.max_salary)}
        </span>
        <span>
          {job.status === 'open' && (
            <span className="px-2 py-1 rounded bg-emerald-500 text-white text-sm">
              Open
            </span>
          )}
          {job.status === 'draft' && (
            <span className="px-2 py-1 rounded bg-amber-500 text-white text-sm">
              Draft
            </span>
          )}
          {job.status === 'closed' && (
            <span className="px-2 py-1 rounded bg-red-500 text-white text-sm">
              Closed
            </span>
          )}
        </span>
      </div>

      <p className="mb-2">{job.about}</p>

      <section className="mb-4">
        <h4 className="font-semibold">Descriptions</h4>
        <ul className="list-disc pl-5">
          {(job.descriptions || []).map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h4 className="font-semibold">Requirements</h4>
        <ul className="list-disc pl-5">
          {(job.requirements || []).map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </section>

      {job.additional_info && job.additional_info.length > 0 && (
        <section className="mb-4">
          <h4 className="font-semibold">Additional Info</h4>
          <ul className="list-disc pl-5">
            {job.additional_info.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-4 text-sm text-text-secondary">
        <div>Posted by: {job.posted_by_name || job.posted_by || '—'}</div>
        <div>
          Created at: {job.created_at ? formatLongDate(job.created_at) : '—'}
        </div>
        <div>
          Updated at: {job.updated_at ? formatLongDate(job.updated_at) : '—'}
        </div>
        <div>Job ID: {job.id}</div>
      </div>
    </div>
  );
}
