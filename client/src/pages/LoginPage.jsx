import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await login(email, password);
      if (res?.user) {
        const role = res.user?.role;
        if (role === 'admin' || role === 'hr') navigate('/dashboard');
        else navigate('/');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal login');
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-surface border border-border rounded shadow-sm">
        <h2 className="text-center text-xl font-semibold text-text-primary mb-4">
          Sign In
        </h2>

        {error && (
          <div className="mb-4 text-error bg-error/10 border border-error/20 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? 'Memproses...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-text-secondary">
          don't have account?{' '}
          <Link
            to="/register"
            className="text-primary hover:text-primary-hover"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
