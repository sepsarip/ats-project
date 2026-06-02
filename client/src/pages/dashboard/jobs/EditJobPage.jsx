import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobForm from '../../../shared/JobForm';
import { fetchJobDetail } from '../../../services/api';
import { updateJob } from '../../../services/jobs';

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

  if (!initial) return <p>Loading…</p>;

  return (
    <div className="p-4 bg-surface rounded border border-border">
      <h2 className="text-lg font-semibold mb-3">Edit Job</h2>
      <JobForm initial={initial} onSubmit={handleSubmit} />
    </div>
  );
}
