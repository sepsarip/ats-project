import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth() || {};

  return (
    <header className="bg-surface border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="text-text-primary font-bold text-lg">Logo</div>

        <nav className="flex items-center gap-3">
          {!user && (
            <Link
              to="/register"
              className="text-text-secondary hover:text-text-primary"
            >
              Daftar
            </Link>
          )}

          {!user ? (
            <Link
              to="/login"
              className="px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded-md"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-text-secondary">
                {user.fullName || user.email}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 bg-transparent border border-border rounded text-text-secondary hover:text-text-primary"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
