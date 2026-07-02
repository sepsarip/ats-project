import React from 'react';

export default function Filters({
  filters,
  onChange,
  onSearch,
  showStatus = false,
  showLimit = false,
  limitOptions = [10, 20, 50],
}) {
  return (
    <div className="w-full flex flex-col md:flex-row md:flex-wrap md:items-center gap-3">
      <input
        aria-label="search"
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="Search job position..."
        className="w-full md:flex-1 md:min-w-[200px] px-3 py-2 border border-border rounded bg-surface text-text-primary focus:outline-none focus:border-primary"
      />

      <select
        value={filters.employment_type || ''}
        onChange={(e) =>
          onChange({ ...filters, employment_type: e.target.value })
        }
        className="w-full md:w-auto px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="">Employment Type</option>
        <option value="full-time">Full-time</option>
        <option value="part-time">Part-time</option>
        <option value="contract">Contract</option>
        <option value="internship">Internship</option>
      </select>

      <select
        value={filters.location || ''}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
        className="w-full md:w-auto px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="">Location</option>
        <option value="onsite">On-site</option>
        <option value="remote">Remote</option>
        <option value="hybrid">Hybrid</option>
      </select>

      {showStatus && (
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="w-full md:w-auto px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-primary"
        >
          <option value="">Status</option>
          <option value="draft">Draft</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      )}

      {showLimit && (
        <select
          value={filters.limit || ''}
          onChange={(e) =>
            onChange({ ...filters, limit: Number(e.target.value) })
          }
          className="w-full md:w-auto px-3 py-2 border border-border rounded bg-surface text-text-primary cursor-pointer focus:outline-none focus:border-primary"
        >
          <option value="">Per page</option>
          {limitOptions.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={onSearch}
        className="w-full md:w-auto px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded md:ml-auto text-center"
      >
        Search
      </button>
    </div>
  );
}
