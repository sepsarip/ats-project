import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { register as registerApi } from '../services/auth';
import { FiArrowLeft } from 'react-icons/fi';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerApi(fullName, email, password);
      // show success message then redirect
      setSuccess('Register berhasil. Mengarahkan ke halaman login...');
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal registrasi');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => navigate('/login'), 2000);
    return () => clearTimeout(t);
  }, [success, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-surface border border-border rounded shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary mb-4"
          type="button"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h2 className="text-center text-xl font-semibold text-text-primary mb-4">
          Register (Jobseeker)
        </h2>

        {error && (
          <div className="mb-4 text-error bg-error/10 border border-error/20 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-success bg-success/10 border border-success/20 p-2 rounded flex items-center justify-between">
            <span>{success}</span>
            <button
              onClick={() => navigate('/login')}
              className="ml-4 px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded"
            >
              Go to login
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            name="fullName"
            value={fullName}
            placeholder="Budi Pratama"
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={email}
            placeholder="budi@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            showToggle
          />

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded"
            >
              {loading ? 'Memproses...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
