import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyProfile } from '../services/profiles';
import { applyToJob } from '../services/applications';

function FieldRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-sm text-text-secondary">{label}</div>
      <div className="text-sm text-text-primary text-right break-all">
        {value || '-'}
      </div>
    </div>
  );
}

function Notice({ tone = 'info', children }) {
  const styles =
    tone === 'error'
      ? 'bg-error/10 border-error/20 text-error'
      : tone === 'warning'
        ? 'bg-warning/10 border-warning/20 text-text-primary'
        : 'bg-sidebar border-border text-text-primary';

  return <div className={`p-3 rounded border ${styles}`}>{children}</div>;
}

export default function ApplyConfirmModal({ open, job, jobId, onClose }) {
  const navigate = useNavigate();
  const { user, initialized, loading } = useAuth() || {};

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  const isJobOpen = job?.status === 'open';
  const isJobseeker = user?.role === 'jobseeker';

  const applicant = useMemo(() => {
    const fullName =
      profileData?.user?.fullName || user?.fullName || user?.name || null;
    const phone = profileData?.profile?.phone || null;
    const portfolioUrl = profileData?.profile?.portfolio_url || null;
    const cvFileName = profileData?.cv?.file_name || null;

    return { fullName, phone, portfolioUrl, cvFileName };
  }, [profileData, user]);

  const canSubmit =
    open &&
    initialized &&
    !loading &&
    isJobOpen &&
    isJobseeker &&
    !profileLoading &&
    !!profileData &&
    !!profileData?.cv &&
    !submitting &&
    !submittedApplication;

  useEffect(() => {
    if (!open) return;

    setProfileError(null);
    setSubmitError(null);
    setSubmittedApplication(null);

    if (!initialized || loading) return;
    if (!user) return;
    if (user.role !== 'jobseeker') return;

    let mounted = true;
    async function loadProfile() {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const data = await getMyProfile();
        if (!mounted) return;
        setProfileData(data);
      } catch (err) {
        if (!mounted) return;
        setProfileError(
          err?.response?.data?.message || err?.message || 'Gagal memuat profil',
        );
        setProfileData(null);
      } finally {
        if (mounted) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [open, initialized, loading, user]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === 'Escape') onClose && onClose();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  async function onSubmit() {
    if (!jobId) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const application = await applyToJob(jobId);
      setSubmittedApplication(application || { id: true });
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message || err?.message || 'Gagal submit aplikasi',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Konfirmasi Apply Job"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose && onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative w-full max-w-2xl mx-4 bg-surface border border-border rounded shadow-lg">
        <div className="p-5 border-b border-border flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Konfirmasi Apply Job
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Pastikan data kamu sudah benar dan lengkap sebelum submit.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
            aria-label="Close"
          >
            &#128936;
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-auto">
          {!isJobOpen && (
            <Notice tone="warning">
              Lowongan ini tidak sedang terbuka untuk apply.
            </Notice>
          )}

          {!initialized || loading ? (
            <div className="text-text-secondary">Memuat...</div>
          ) : !user ? (
            <Notice>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">Login diperlukan</div>
                  <div className="text-sm text-text-secondary mt-1">
                    Silakan login untuk melanjutkan apply.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 rounded bg-primary hover:bg-primary-hover text-white"
                >
                  Login
                </button>
              </div>
            </Notice>
          ) : !isJobseeker ? (
            <Notice tone="warning">
              Hanya akun dengan role <b>jobseeker</b> yang bisa apply.
            </Notice>
          ) : submittedApplication ? (
            <Notice>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-success">
                    Application submitted successfully
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    Kamu bisa cek statusnya di History Applications.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose && onClose();
                    navigate('/account/settings?tab=history');
                  }}
                  className="px-3 py-2 rounded bg-primary hover:bg-primary-hover text-white"
                >
                  Lihat aplikasi
                </button>
              </div>
            </Notice>
          ) : (
            <>
              {profileError && <Notice tone="error">{profileError}</Notice>}
              {submitError && <Notice tone="error">{submitError}</Notice>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="p-4 rounded border border-border bg-background">
                  <h4 className="font-semibold text-text-primary">
                    Ringkasan Job
                  </h4>
                  <div className="mt-3 space-y-2">
                    <FieldRow label="Title" value={job?.title} />
                    <FieldRow label="Location" value={job?.location} />
                    <FieldRow label="Employment" value={job?.employment_type} />
                  </div>
                </section>

                <section className="p-4 rounded border border-border bg-background">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-text-primary">
                      Profil Kamu
                    </h4>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose && onClose();
                          navigate('/account/settings?tab=profiles');
                        }}
                        className="text-sm px-2 py-1 rounded bg-primary hover:bg-primary-hover text-white"
                      >
                        Update Profil
                      </button>
                    </div>
                  </div>

                  {profileLoading ? (
                    <div className="mt-3 text-text-secondary">Memuat...</div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <FieldRow label="Fullname" value={applicant.fullName} />
                      <FieldRow label="Phone" value={applicant.phone} />
                      <FieldRow label="CV" value={applicant.cvFileName} />
                      <FieldRow
                        label="Portfolio"
                        value={applicant.portfolioUrl}
                      />
                    </div>
                  )}

                  {!profileLoading && profileData && !profileData?.cv && (
                    <div className="mt-3">
                      <Notice tone="warning">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium">CV belum ada</div>
                            <div className="text-sm text-text-secondary mt-1">
                              Silahkan Upload CV sebelum apply job.
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onClose && onClose();
                              navigate('/account/settings?tab=cv');
                            }}
                            className="px-3 py-2 rounded bg-sidebar hover:bg-border text-text-primary"
                          >
                            Kelola CV
                          </button>
                        </div>
                      </Notice>
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </div>

        <div className="p-5 border-t border-border flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded border border-border bg-surface text-text-primary hover:bg-background"
          >
            {submittedApplication ? 'Tutup' : 'Cancel'}
          </button>

          {!submittedApplication && (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="px-3 py-2 rounded bg-primary hover:bg-primary-hover text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Confirm Apply'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
