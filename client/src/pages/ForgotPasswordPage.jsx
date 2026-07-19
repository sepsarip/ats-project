import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { requestForgotPassword } from '../services/auth';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await requestForgotPassword(email);
      setSuccessMessage(
        res?.message ||
        'Jika email terdaftar, instruksi reset password telah dikirim ke email tersebut.',
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Gagal mengirim permintaan reset password. Silakan coba lagi.',
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
          Forgot Password
        </h2>
        <p className="text-center text-sm text-text-secondary mb-6">
          Enter your email address to receive a password reset link.
        </p>

        {error && (
          <div className="mb-4 text-error bg-error/10 border border-error/20 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 text-success rounded text-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 font-medium">
              <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>Email Sent</span>
            </div>
            <p className="text-text-secondary text-xs">{successMessage}</p>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={email}
              placeholder="budi@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-text-secondary">
          Remembered your password?{' '}
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
