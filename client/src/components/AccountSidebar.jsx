import React from 'react';
import { FiX, FiLogOut, FiUser, FiClock, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AccountSidebar({
  active = 'profiles',
  onChange,
  onClose,
}) {
  const { logout } = useAuth() || {};
  const items = [
    { key: 'profiles', label: 'Profiles', icon: FiUser },
    { key: 'history', label: 'History Applications', icon: FiClock },
    { key: 'cv', label: 'Manage Resume', icon: FiFileText },
  ];

  return (
    <aside className="w-64 h-full bg-sidebar p-4 border-r border-border flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary">Settings</h3>
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
            const Icon = it.icon;
            return (
              <button
                key={it.key}
                onClick={() => onChange && onChange(it.key)}
                className={`flex items-center gap-2 text-left px-3 py-2 rounded transition-colors ${active === it.key
                  ? 'bg-primary text-white'
                  : 'text-text-primary hover:bg-primary hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{it.label}</span>
              </button>
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
