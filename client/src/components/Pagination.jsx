import React from 'react';

export default function Pagination({ meta = {}, onPageChange }) {
  const {
    page = 1,
    totalPages = 1,
    hasNextPage = false,
    hasPrevPage = false,
  } = meta;

  return (
    <div className="mt-6 flex items-center justify-between text-sm text-text-secondary">
      <div>
        Page {page} / {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!hasPrevPage}
          className="px-3 py-1 border border-border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
