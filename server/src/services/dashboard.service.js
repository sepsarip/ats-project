import * as jobsModel from '../models/jobs.model.js';
import * as applicationsModel from '../models/applications.model.js';

const APP_STATUS_KEYS = {
  applied: 'total_applied',
  interview: 'total_interview',
  offered: 'total_offered',
  hired: 'total_hired',
  rejected: 'total_rejected',
};

const JOB_STATUS_KEYS = {
  draft: 'total_jobs_draft',
  open: 'total_jobs_open',
  closed: 'total_jobs_closed',
};

export async function getDashboardStats() {
  // run independent queries in parallel for performance
  const [totalJobs, jobsByStatus, appsByStatus] = await Promise.all([
    jobsModel.countJobs(),
    jobsModel.countJobsGroupedByStatus(),
    applicationsModel.countApplicationsGroupedByStatus(),
  ]);

  // initialize defaults
  const data = {
    total_jobs: totalJobs ?? 0,
    total_jobs_draft: 0,
    total_jobs_open: 0,
    total_jobs_closed: 0,
    total_applied: 0,
    total_interview: 0,
    total_offered: 0,
    total_hired: 0,
    total_rejected: 0,
  };

  // map job status rows
  for (const row of jobsByStatus || []) {
    const key = JOB_STATUS_KEYS[row.status];
    if (key) data[key] = row.count ?? 0;
  }

  // map application status rows
  for (const row of appsByStatus || []) {
    const key = APP_STATUS_KEYS[row.status];
    if (key) data[key] = row.count ?? 0;
  }

  return data;
}

export default { getDashboardStats };
