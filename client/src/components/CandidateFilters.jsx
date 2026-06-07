import React from 'react';

export default function CandidateFilters({
  filters,
  onChange,
  onApply,
  limitOptions = [10, 20, 50],
  search,
  onSearchChange,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">
      {onSearchChange && (
        <input
          type="text"
          value={search || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama atau email..."
          className="w-full md:flex-1 md:min-w-[200px] px-3 py-2 border border-border rounded bg-surface text-text-primary focus:outline-none focus:border-primary"
        />
      )}

      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="w-full md:w-auto px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="">Semua Status</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offered">Offered</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>

      <select
        value={filters.gender || ''}
        onChange={(e) => onChange({ ...filters, gender: e.target.value })}
        className="w-full md:w-auto px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="">Semua Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <input
        aria-label="city"
        value={filters.city || ''}
        onChange={(e) => onChange({ ...filters, city: e.target.value })}
        placeholder="City"
        className="w-full md:w-32 px-3 py-2 border border-border rounded bg-surface text-text-primary focus:outline-none focus:border-primary"
      />

      <input
        aria-label="province"
        value={filters.province || ''}
        onChange={(e) => onChange({ ...filters, province: e.target.value })}
        placeholder="Province"
        className="w-full md:w-32 px-3 py-2 border border-border rounded bg-surface text-text-primary focus:outline-none focus:border-primary"
      />

      <select
        value={filters.limit || ''}
        onChange={(e) =>
          onChange({ ...filters, limit: Number(e.target.value) })
        }
        className="w-full md:w-auto px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="">Per halaman</option>
        {limitOptions.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>

      <button
        onClick={onApply}
        className="w-full md:w-auto px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded md:ml-auto text-center"
      >
        Terapkan
      </button>
    </div>
  );
}
