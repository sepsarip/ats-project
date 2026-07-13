import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  fetchJobCandidateDetail,
  downloadCandidateResume,
} from '../../../services/candidates';
import { updateApplicationStatus } from '../../../services/applications';
import { APPLICATION_STATUSES } from '../../../constants/applicationStatuses';
import { formatLongDate, formatShortDate } from '../../../utils/formatters';
import { triggerDownload } from '../../../utils/download';
import { FiCheck, FiDownload, FiLoader } from 'react-icons/fi';

export default function CandidateDetailPage() {
  const { jobId, userId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusDraft, setStatusDraft] = useState('');

  const load = useCallback(async () => {
    if (!jobId || !userId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchJobCandidateDetail(jobId, userId);
      setData(res);
      setStatusDraft(res?.application?.status || 'applied');
    } catch (e) {
      console.error('Failed to load candidate detail', e);
      setError('Failed to load candidate detail');
    } finally {
      setLoading(false);
    }
  }, [jobId, userId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDownloadResume() {
    setDownloading(true);
    try {
      const { blob, filename } = await downloadCandidateResume(jobId, userId);
      triggerDownload(blob, filename);
    } catch (e) {
      console.error('Download Resume failed', e);
      alert('Download Resume failed');
    } finally {
      setDownloading(false);
    }
  }

  async function handleUpdateStatus() {
    const applicationId = data?.application?.id;
    if (!applicationId) return;

    setUpdating(true);
    try {
      const updated = await updateApplicationStatus(applicationId, statusDraft);
      if (updated?.status) {
        setData((prev) => ({
          ...prev,
          application: { ...prev.application, status: updated.status },
        }));
      }
    } catch (e) {
      console.error('Update status failed', e);
      alert('Update status failed');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-error">{error}</p>;
  if (!data) return <p>Candidate not found.</p>;

  const { job, application, user, profile, resume } = data;

  return (
    <div className="p-4 bg-surface rounded border border-border">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Candidate Detail</h2>
          <div className="text-sm text-text-secondary">
            {job?.title
              ? `${job.title} (Job ID: ${job.id})`
              : `Job ID: ${jobId}`}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/dashboard/candidates/jobs/${jobId}`}
            className="px-3 py-2 border border-border rounded text-text-primary hover:bg-sidebar"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-border rounded p-3">
          <h3 className="font-semibold mb-2">Application</h3>
          <div className="text-sm text-text-primary space-y-1">
            <div>
              <span className="text-text-secondary">Status:</span>{' '}
              {application?.status || '-'}
            </div>
            <div>
              <span className="text-text-secondary">Resume Score:</span>{' '}
              {application?.score === null || application?.score === undefined
                ? '-'
                : application.score}{' '}
              {'/ 100.00'}
            </div>
            <div>
              <span className="text-text-secondary">Applied at:</span>{' '}
              {application?.applied_at
                ? formatLongDate(application.applied_at)
                : '-'}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 bg-sidebar rounded p-0.5 border border-border">
              <select
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
                className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer px-1 py-0.5"
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option
                    key={s.value}
                    value={s.value}
                    className="bg-surface text-text-primary"
                  >
                    {s.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleUpdateStatus}
                disabled={updating || statusDraft === application?.status}
                title="Update Status"
                className="inline-flex items-center justify-center w-7 h-7 rounded bg-warning text-white hover:bg-amber-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiCheck className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="border border-border rounded p-3">
          <h3 className="font-semibold mb-2">Candidate</h3>
          <div className="text-sm text-text-primary space-y-1">
            <div>
              <span className="text-text-secondary">Name:</span>{' '}
              {user?.fullName || user?.full_name || '-'}
            </div>
            <div>
              <span className="text-text-secondary">Email:</span>{' '}
              {user?.email || '-'}
            </div>
            <div>
              <span className="text-text-secondary">Phone:</span>{' '}
              {profile?.phone || '-'}
            </div>
            <div>
              <span className="text-text-secondary">City:</span>{' '}
              {profile?.city || '-'}
            </div>
            <div>
              <span className="text-text-secondary">Province:</span>{' '}
              {profile?.province || '-'}
            </div>
          </div>
        </section>

        <section className="border border-border rounded p-3 md:col-span-2">
          <h3 className="font-semibold mb-2">Profile</h3>
          <div className="text-sm text-text-primary space-y-1">
            <div>
              <span className="text-text-secondary">Bio:</span>{' '}
              {profile?.bio || '-'}
            </div>
            <div>
              <span className="text-text-secondary">LinkedIn:</span>{' '}
              {profile?.linkedin_url ? (
                <a
                  className="text-primary hover:underline"
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.linkedin_url}
                </a>
              ) : (
                '-'
              )}
            </div>
            <div>
              <span className="text-text-secondary">Portfolio:</span>{' '}
              {profile?.portfolio_url ? (
                <a
                  className="text-primary hover:underline"
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {profile.portfolio_url}
                </a>
              ) : (
                '-'
              )}
            </div>
            <div>
              <span className="text-text-secondary">Birth date:</span>{' '}
              {formatShortDate(profile?.birth_date) || '-'}
            </div>
          </div>
        </section>

        <section className="border border-border rounded p-3 md:col-span-2">
          <h3 className="font-semibold mb-2">Resume</h3>
          <div className="text-sm text-text-primary flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-text-secondary">File:</span>{' '}
              {resume?.file_name || '-'}
            </div>
            <button
              onClick={handleDownloadResume}
              disabled={downloading}
              title={downloading ? 'Downloading Resume...' : 'Download Resume'}
              className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded hover:bg-sidebar text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin text-primary" />
                </>
              ) : (
                <>
                  <FiDownload className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
