import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobForm from '../../../shared/JobForm';
import { fetchJobDetail } from '../../../services/api';
import { updateJob } from '../../../services/jobs';
import { FiEdit3 } from 'react-icons/fi';

export default function JobEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    (async () => {
      const j = await fetchJobDetail(id);
      setInitial(j);
    })();
  }, [id]);

  async function handleSubmit(values) {
    // use status from submitted values (fallback to initial or draft)
    const payload = {
      ...values,
      status: values.status || initial?.status || 'draft',
    };
    const job = await updateJob(id, payload);
    if (job?.id) navigate(`/dashboard/jobs/${job.id}`);
  }

  if (!initial) return <div className="text-text-secondary p-4">Loading…</div>;

  return (
    <div className="p-6 bg-surface border border-border rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2 border-b border-border/60 pb-4">
        <FiEdit3 className="w-5.5 h-5.5 text-warning" />
        <span>Edit Job</span>
      </h2>
      <JobForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
