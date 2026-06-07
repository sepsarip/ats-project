import React from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../../../shared/JobForm';
import { createJob } from '../../../services/jobs';
import { FiPlusCircle } from 'react-icons/fi';

export default function JobCreatePage() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    // ensure default status
    const payload = { ...values, status: 'draft' };
    const job = await createJob(payload);
    if (job?.id) navigate(`/dashboard/jobs/${job.id}`);
  }

  return (
    <div className="p-6 bg-surface border border-border rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-border/60 pb-4">
        <FiPlusCircle className="w-5.5 h-5.5 text-primary" />
        <span>Create New Job</span>
      </h2>
      <JobForm onSubmit={handleSubmit} />
    </div>
  );
}
