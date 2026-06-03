import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar({ onClose }) {
  const loc = useLocation();
  const { user } = useAuth() || {};
  const isAdmin = user?.role === 'admin';
  const items = [
    { to: '/dashboard', label: 'Beranda' },
    { to: '/dashboard/jobs', label: 'Job Management' },
    { to: '/dashboard/candidates', label: 'Candidate Management' },
  ];

  if (isAdmin) {
    items.push({ to: '/dashboard/hr/create', label: 'Create HR Account' });
  }

  return (
    <aside className="w-64 bg-sidebar p-4 rounded border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Dashboard</h3>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="md:hidden ml-auto text-text-secondary hover:text-text-primary"
          >
            ✕
          </button>
        )}
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((it) => {
          const isRootDashboard = it.to === '/dashboard';
          const isActive = isRootDashboard
            ? loc.pathname === '/dashboard'
            : loc.pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={onClose}
              className={`text-left px-3 py-2 rounded ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
