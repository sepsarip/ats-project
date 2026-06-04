import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiX, FiLogOut, FiHome, FiBriefcase, FiUsers, FiUserPlus } from 'react-icons/fi';

export default function DashboardSidebar({ onClose }) {
  const loc = useLocation();
  const { user, logout } = useAuth() || {};
  const isAdmin = user?.role === 'admin';
  const items = [
    { to: '/dashboard', label: 'Beranda', icon: FiHome },
    { to: '/dashboard/jobs', label: 'Job Management', icon: FiBriefcase },
    { to: '/dashboard/candidates', label: 'Candidate Management', icon: FiUsers },
  ];

  if (isAdmin) {
    items.push({ to: '/dashboard/hr/create', label: 'Create HR Account', icon: FiUserPlus });
  }

  return (
    <aside className="w-64 h-full bg-sidebar p-4 border-r border-border flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary">Dashboard</h3>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="md:hidden ml-auto text-text-secondary hover:text-text-primary"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
        <nav className="flex flex-col gap-2">
          {items.map((it) => {
            const isRootDashboard = it.to === '/dashboard';
            const isActive = isRootDashboard
              ? loc.pathname === '/dashboard'
              : loc.pathname.startsWith(it.to);
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={onClose}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${isActive
                  ? 'bg-primary text-white'
                  : 'text-text-primary hover:bg-primary hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <Link
          to="/"
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          className="flex items-center gap-2 px-3 py-2 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
