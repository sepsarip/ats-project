import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FormInput from '../components/FormInput';
import { changePassword } from '../services/auth';
import { FiArrowLeft } from 'react-icons/fi';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Front-end validations
    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    if (newPassword === oldPassword) {
      setError('Password baru tidak boleh sama dengan password lama');
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword(
        oldPassword,
        newPassword,
        confirmPassword,
      );
      setSuccess(res?.message || 'Password berhasil diubah');
      // Reset form fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md p-6 bg-surface border border-border rounded shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-4"
            type="button"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-center text-xl font-semibold text-text-primary mb-6">
            Change Password
          </h1>

          {error && (
            <div className="mb-4 text-sm text-error bg-error/10 border border-error/20 p-2.5 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-sm text-success bg-success/10 border border-success/20 p-2.5 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Password Lama"
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              showToggle
            />
            <FormInput
              label="Password Baru"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              showToggle
            />
            <FormInput
              label="Konfirmasi Password Baru"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              showToggle
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Memproses...' : 'Ubah Password'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
