import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { resetPassword } from '../services/auth';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Token reset password tidak ditemukan pada URL.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, newPassword, confirmPassword);
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Gagal me-reset password. Link mungkin sudah kadaluarsa atau tidak valid.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-surface border border-border rounded shadow-sm">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
          type="button"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </button>

        <h2 className="text-center text-xl font-semibold text-text-primary mb-2">
          Set New Password
        </h2>
        <p className="text-center text-sm text-text-secondary mb-6">
          Enter a new password for your account.
        </p>

        {error && (
          <div className="mb-4 text-error bg-error/10 border border-error/20 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-success/10 border border-success/20 text-success rounded text-sm flex items-center gap-3">
              <FiCheckCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Password reset successfully!</p>
                <p className="text-text-secondary text-xs">
                  You can now login using your new password.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded font-medium transition-colors"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              placeholder="••••••••"
              onChange={(e) => setNewPassword(e.target.value)}
              required
              showToggle
            />

            <FormInput
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              showToggle
            />

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-text-secondary">
          Return to{' '}
          <Link
            to="/login"
            className="text-primary hover:text-primary-hover font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
