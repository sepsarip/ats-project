import React from 'react';

export default function CandidateFilters({
  filters,
  onChange,
  onApply,
  limitOptions = [10, 20, 50],
}) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-col md:flex-row md:items-center gap-3">
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer"
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
          className="px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer"
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
          className="px-3 py-2 border border-border rounded bg-surface text-text-primary"
        />

        <input
          aria-label="province"
          value={filters.province || ''}
          onChange={(e) => onChange({ ...filters, province: e.target.value })}
          placeholder="Province"
          className="px-3 py-2 border border-border rounded bg-surface text-text-primary"
        />

        <select
          value={filters.limit || ''}
          onChange={(e) =>
            onChange({ ...filters, limit: Number(e.target.value) })
          }
          className="px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer"
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
          className="px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded"
        >
          Terapkan
        </button>
      </div>
    </div>
  );
}
