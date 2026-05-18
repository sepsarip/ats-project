import React from 'react';

export default function JobCard({ job }) {
  const {
    title,
    posted_by_name,
    location,
    employment_type,
    about,
    min_salary,
    max_salary,
    status,
  } = job || {};

  return (
    <article className="flex flex-col h-full border border-border bg-surface p-4 rounded-md shadow-sm">
      <header className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        {status && (
          <span
            className={`ml-2 text-sm font-medium px-2 py-1 rounded-md text-white ${status === 'open' ? 'bg-success' : status === 'draft' ? 'bg-warning' : 'bg-error'}`}
          >
            {status}
          </span>
        )}
      </header>

      <div className="mt-3 flex flex-wrap gap-2 text-sm text-text-primary">
        {location && (
          <span className="px-2 py-1 bg-sidebar rounded text-text-primary">
            {location}
          </span>
        )}
        {employment_type && (
          <span className="px-2 py-1 bg-sidebar rounded text-text-primary">
            {employment_type}
          </span>
        )}
      </div>

      {about && (
        <p className="mt-3 text-sm text-text-secondary line-clamp-4">{about}</p>
      )}

      <div className="mt-auto pt-4 flex justify-center">
        <button className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded-md text-sm">
          Lihat Detail
        </button>
      </div>
    </article>
  );
}
