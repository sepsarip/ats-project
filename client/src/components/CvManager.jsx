import React, { useEffect, useState } from 'react';
import { getMyProfile } from '../services/profiles';
import { uploadMyCv, deleteMyCv } from '../services/cv';
import { formatFileSize } from '../utils/formatters';
import { FiFileText, FiUploadCloud, FiTrash2, FiPlus, FiAlertCircle } from 'react-icons/fi';

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
      {message && (
        <div className="mb-4 text-sm text-success bg-success/10 border border-success/20 p-3 rounded-lg flex items-center gap-2">
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 text-sm text-error bg-error/10 border border-error/20 p-3 rounded-lg flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6">
        {cv ? (
          <div className="space-y-4">
            <div className="p-4 border border-border bg-zinc-50 rounded-lg flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <FiFileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm break-all max-w-[200px] sm:max-w-xs md:max-w-md">
                    {cv.file_name}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    File Size: {formatFileSize(cv.file_size)}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-60"
                title="Hapus CV"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Langsung Update CV Baru</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="cursor-pointer bg-white border border-border hover:bg-zinc-50 text-text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center justify-center gap-1.5 flex-1">
                  <FiUploadCloud className="w-4 h-4 text-text-secondary" />
                  <span>Pilih File PDF Baru</span>
                  <input
                    aria-label="Upload CV"
                    type="file"
                    accept="application/pdf"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </label>
                {selectedFile && (
                  <button
                    onClick={onUpload}
                    disabled={uploading}
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors shadow-md flex items-center justify-center gap-1.5 flex-1"
                  >
                    <span>{uploading ? 'Mengunggah...' : 'Simpan Perubahan'}</span>
                  </button>
                )}
              </div>
              {selectedFile && (
                <div className="mt-3 text-xs text-text-primary font-medium bg-zinc-100 px-3 py-2 rounded-lg border border-border inline-flex items-center gap-2">
                  <FiFileText className="text-primary w-4 h-4" />
                  <span>Terpilih: {selectedFile.name} ({formatFileSize(selectedFile.size)})</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center bg-zinc-50 hover:bg-zinc-100/50 transition-colors flex flex-col items-center">
            <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200 shadow-inner">
              <FiUploadCloud className="w-7 h-7" />
            </div>
            <h4 className="font-semibold text-text-primary mb-1 text-sm">Upload CV Anda</h4>
            <p className="text-xs text-text-secondary mb-4 max-w-xs leading-relaxed">
              Unggah CV Anda dalam format PDF untuk melamar pekerjaan dengan mudah. Maksimal ukuran file adalah 2MB.
            </p>
            <label className="cursor-pointer bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5">
              <FiPlus className="w-4 h-4" />
              Pilih File PDF
              <input
                aria-label="Upload CV"
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <div className="mt-4 w-full max-w-xs">
                <div className="text-xs text-text-primary font-medium bg-white p-3 rounded-lg border border-border flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <FiFileText className="text-primary w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{selectedFile.name}</span>
                  </div>
                  <span className="text-text-secondary text-[10px] flex-shrink-0">{formatFileSize(selectedFile.size)}</span>
                </div>
                <button
                  onClick={onUpload}
                  disabled={uploading}
                  className="mt-3 w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>{uploading ? 'Mengunggah...' : 'Unggah Sekarang'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
