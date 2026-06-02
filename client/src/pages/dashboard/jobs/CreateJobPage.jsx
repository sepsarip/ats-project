import React from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../../../shared/JobForm';
import { createJob } from '../../../services/jobs';

export default function JobCreatePage() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    // ensure default status
    const payload = { ...values, status: 'draft' };
    const job = await createJob(payload);
    if (job?.id) navigate(`/dashboard/jobs/${job.id}`);
  }

  return (
    <div className="p-4 bg-surface rounded border border-border">
      <h2 className="text-lg font-semibold mb-3">Create New Job</h2>
      <JobForm onSubmit={handleSubmit} />
    </div>
  );
}
