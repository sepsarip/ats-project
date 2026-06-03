import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth() || {};
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  function initials(name, email) {
    const source = name || email || '';
    const parts = source.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return (
    <header className="bg-surface border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-text-primary font-bold text-lg">
          Logo
        </Link>

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
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen((s) => !s)}
                aria-expanded={open}
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm"
                title={user.fullName || user.email}
              >
                {initials(user.fullName, user.email)}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded shadow-lg z-50">
                  <div className="px-3 py-2 border-b border-border text-text-primary font-medium">
                    {user.fullName || user.email}
                  </div>
                  <div className="flex flex-col">
                    {(user.role === 'admin' || user.role === 'hr') && (
                      <Link
                        to="/dashboard"
                        className="px-3 py-2 text-text-primary hover:bg-background"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'jobseeker' && (
                      <Link
                        to="/account/settings"
                        className="px-3 py-2 text-text-primary hover:bg-background"
                        onClick={() => setOpen(false)}
                      >
                        Settings
                      </Link>
                    )}
                    <Link
                      to="/change-password"
                      className="px-3 py-2 text-text-primary hover:bg-background"
                      onClick={() => setOpen(false)}
                    >
                      Change Password
                    </Link>
                    <Link
                      to="/"
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="px-3 py-2 text-text-primary hover:bg-background"
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
