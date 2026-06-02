import React from 'react';
import { Link } from 'react-router-dom';

import { APPLICATION_STATUSES } from '../../../constants/applicationStatuses';

export default function CandidatesLandingPage() {
  return (
    <div className="p-4 bg-surface rounded border border-border">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Candidate Management</h2>
          <p className="text-text-secondary mt-1">
            Kandidat ditampilkan per lowongan. Pilih lowongan di Job Management
            lalu buka halaman Candidates untuk melihat daftar kandidat.
          </p>
        </div>
        <Link
          to="/dashboard/jobs"
          className="inline-block px-3 py-3 bg-primary hover:bg-primary-hover text-white rounded whitespace-nowrap"
        >
          Job Management
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-10">
        <div className="p-4 rounded border border-border bg-sidebar">
          <h3 className="font-semibold mb-2">Cara Pakai:</h3>
          <ol className="list-decimal pl-5 text-sm text-text-secondary space-y-1">
            <li>Buka Job Management.</li>
            <li>Pilih lowongan yang ingin dilihat kandidatnya.</li>
            <li>Klik tombol Candidates untuk membuka daftar kandidat.</li>
          </ol>
        </div>

        <div className="p-4 rounded border border-border bg-sidebar">
          <h3 className="font-semibold mb-2">Yang Bisa Dilakukan:</h3>
          <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1">
            <li>Filter kandidat (status, gender, city, province).</li>
            <li>Pagination dan pengaturan limit per halaman.</li>
            <li>Lihat detail kandidat dan download CV.</li>
            <li>Update status lamaran kandidat.</li>
          </ul>
        </div>

        <div className="p-4 rounded border border-border bg-sidebar">
          <h3 className="font-semibold mb-2">Status Lamaran:</h3>
          <div className="text-sm text-text-secondary space-y-1">
            {APPLICATION_STATUSES.map((status) => (
              <div key={status.value} className="flex items-center gap-2">
                <span className="font-medium text-text-primary">
                  {status.label}
                </span>
                <span className="text-xs px-2 py-1 rounded border border-border">
                  {status.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
