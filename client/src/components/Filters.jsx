import React from 'react';

export default function Filters({ filters, onChange, onSearch }) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center gap-3">
      <input
        aria-label="search"
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="Cari posisi yang anda inginkan..."
        className="flex-1 px-3 py-2 border border-border rounded bg-surface text-text-primary"
      />

      <select
        value={filters.employment_type || ''}
        onChange={(e) =>
          onChange({ ...filters, employment_type: e.target.value })
        }
        className="px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer"
      >
        <option value="">Jenis Pekerjaan</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
        <option value="internship">Internship</option>
      </select>

      <select
        value={filters.location || ''}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
        className="px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer"
      >
        <option value="">Lokasi</option>
        <option value="onsite">On-site</option>
        <option value="remote">Remote</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <button
        onClick={onSearch}
        className="px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded"
      >
        Cari
      </button>
    </div>
  );
}
