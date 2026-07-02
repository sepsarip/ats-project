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
            Candidates are displayed per job. Select a job in Job Management
            and then open the Candidates page to see the list of candidates.
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
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ol className="list-decimal pl-5 text-sm text-text-secondary space-y-1">
            <li>Open Job Management.</li>
            <li>Select the job you want to see candidates for.</li>
            <li>Click the Candidates button to open the candidate list.</li>
          </ol>
        </div>

        <div className="p-4 rounded border border-border bg-sidebar">
          <h3 className="font-semibold mb-2">What You Can Do:</h3>
          <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1">
            <li>Filter candidates (status, gender, city, province).</li>
            <li>Pagination and limit settings per page.</li>
            <li>View candidate details and download Resume.</li>
            <li>Update candidate application status.</li>
          </ul>
        </div>

        <div className="p-4 rounded border border-border bg-sidebar">
          <h3 className="font-semibold mb-2">Applications Status:</h3>
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
