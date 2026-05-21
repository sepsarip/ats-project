import React from 'react';

export default function AccountSidebar({
  active = 'profiles',
  onChange,
  onClose,
}) {
  const items = [
    { key: 'profiles', label: 'Profiles' },
    { key: 'history', label: 'History Applications' },
    { key: 'cv', label: 'CV' },
  ];

  return (
    <aside className="w-64 bg-sidebar p-4 rounded border border-border">
      <div className="flex items-center justify-between mb-3">
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="md:hidden ml-auto text-text-secondary hover:text-text-primary"
          >
            &#128936;
          </button>
        )}
      </div>
      <nav className="flex flex-col gap-2">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => onChange && onChange(it.key)}
            className={`text-left px-3 py-2 rounded ${
              active === it.key
                ? 'bg-primary text-white'
                : 'text-text-primary hover:bg-primary hover:text-white'
            }`}
          >
            {it.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
