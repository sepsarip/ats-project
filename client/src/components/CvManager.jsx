import React, { useEffect, useState } from 'react';
import { getMyProfile } from '../services/profiles';
import { uploadMyCv, deleteMyCv } from '../services/cv';
import { formatFileSize } from '../utils/formatters';

export default function CvManager() {
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyProfile();
      setCv(data?.cv || null);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Gagal memuat CV',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFileChange = (e) => {
    setMessage(null);
    setError(null);
    const f = e.target.files && e.target.files[0];
    setSelectedFile(f || null);
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const uploaded = await uploadMyCv(selectedFile);
      if (uploaded) {
        setCv(uploaded);
        setMessage('CV uploaded successfully');
      } else {
        setMessage('CV uploaded');
      }
      setSelectedFile(null);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Gagal upload CV',
      );
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async () => {
    if (!cv) return;
    const ok = window.confirm('Hapus CV? Aksi ini tidak dapat dibatalkan.');
    if (!ok) return;

    setDeleting(true);
    setError(null);
    setMessage(null);
    try {
      await deleteMyCv();
      setCv(null);
      setMessage('CV deleted successfully');
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || 'Gagal menghapus CV',
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-text-secondary">Memuat...</div>;

  return (
    <div>
      {message && <div className="mb-3 text-success">{message}</div>}
      {error && <div className="mb-3 text-error">{error}</div>}

      <div className="mb-4">
        {cv ? (
          <div className="p-3 border border-border bg-background rounded">
            <div className="font-medium text-text-primary">{cv.file_name}</div>
            <div className="text-sm text-text-secondary mt-1">
              File Size: {formatFileSize(cv.file_size)}
            </div>
          </div>
        ) : (
          <div className="text-text-secondary">Belum ada CV</div>
        )}
      </div>

      <form onSubmit={onUpload} className="space-y-3">
        <div>
          <input
            aria-label="Upload CV"
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!selectedFile || uploading}
            className="px-3 py-1 rounded bg-primary hover:bg-primary-hover text-white disabled:opacity-60"
          >
            {cv ? 'Update CV' : 'Upload CV'}
          </button>

          {cv && (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="px-3 py-1 rounded bg-error text-white disabled:opacity-60"
            >
              Delete CV
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
