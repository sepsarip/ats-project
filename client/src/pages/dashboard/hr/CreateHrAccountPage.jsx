import React, { useState } from 'react';
import FormInput from '../../../components/FormInput';
import { createHrUser } from '../../../services/adminUsers';

export default function CreateHrAccountPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    const payload = {
      fullName: (fullName || '').trim(),
      email: (email || '').trim(),
      password: password || '',
    };

    setSubmitting(true);
    try {
      await createHrUser(payload);
      setSuccessMessage('HR created successfully');
      setFullName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Failed to create HR account');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 bg-surface rounded border border-border">
      <h2 className="text-lg font-semibold mb-3">Create HR Account</h2>

      {submitError && (
        <div className="mb-3 text-error bg-error/10 border border-error/20 p-2 rounded">
          {submitError}
        </div>
      )}

      {successMessage && (
        <div className="mb-3 text-success bg-success/10 border border-success/20 p-2 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <FormInput
          label="Full Name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jhon Doe"
          required
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. jhondoe@example.com"
          required
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 6 characters"
          required
          showToggle
        />

        <button
          type="submit"
          disabled={submitting}
          className="px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Create HR'}
        </button>
      </form>
    </div>
  );
}
