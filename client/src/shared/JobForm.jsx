import React, { useState } from 'react';
import FormInput from '../components/FormInput';
import { normalizeJobForm, validateJobForm } from '../utils/jobFormValidation';

function ArrayInput({ value = [], onChange, placeholder }) {
  const add = () => onChange([...(value || []), '']);
  const setAt = (i, v) =>
    onChange(value.map((it, idx) => (idx === i ? v : it)));
  const removeAt = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="mb-2">
      {(value || []).map((it, i) => (
        <div key={i} className="flex gap-2 mb-1">
          <input
            value={it}
            onChange={(e) => setAt(i, e.target.value)}
            className="flex-1 border p-1 rounded"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            className="px-2 text-white bg-error hover:bg-red-700 rounded"
          >
            &#128936;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="px-2 py-1 bg-primary hover:bg-primary-hover text-white rounded"
      >
        &#10011; Add
      </button>
    </div>
  );
}

export default function JobForm({
  initial = {},
  onSubmit,
  employmentOptions,
  locationOptions,
}) {
  const [title, setTitle] = useState(initial.title || '');
  const [about, setAbout] = useState(initial.about || '');
  const [descriptions, setDescriptions] = useState(initial.descriptions || []);
  const [requirements, setRequirements] = useState(initial.requirements || []);
  const [additional_info, setAdditionalInfo] = useState(
    initial.additional_info || [],
  );
  const [employment_type, setEmploymentType] = useState(
    initial.employment_type || '',
  );
  const [location, setLocation] = useState(initial.location || '');
  const [min_salary, setMinSalary] = useState(initial.min_salary || '');
  const [max_salary, setMaxSalary] = useState(initial.max_salary || '');
  const [status, setStatus] = useState(initial.status || '');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultEmployment = [
    'full-time',
    'part-time',
    'contract',
    'internship',
  ];
  const defaultLocations = ['onsite', 'remote', 'hybrid'];
  const employmentList = employmentOptions || defaultEmployment;
  const locationList = locationOptions || defaultLocations;
  const defaultStatusList = ['draft', 'open', 'closed'];
  const statusList = initial.status ? defaultStatusList : defaultStatusList;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);

    const normalized = normalizeJobForm({
      title,
      about,
      descriptions,
      requirements,
      additional_info,
      employment_type,
      location,
      min_salary,
      max_salary,
      status,
    });

    const { errors: vErrors, isValid } = validateJobForm(normalized, {
      requireStatus: initial.status !== undefined,
    });

    if (!isValid) {
      setErrors(vErrors);
      setSubmitError('Periksa kembali field yang error');
      return;
    }

    const payload = { ...normalized };
    // omit empty arrays to avoid sending unnecessary empty fields
    if (!payload.additional_info || payload.additional_info.length === 0)
      delete payload.additional_info;

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Gagal menyimpan job');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {submitError && (
        <div className="mb-2 text-error bg-error/10 border border-error/20 p-2 rounded">
          {submitError}
        </div>
      )}

      <FormInput
        label="Job Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setErrors((s) => ({ ...s, title: undefined }));
        }}
        placeholder="e.g. Software Engineer"
        error={errors.title}
      />
      <label className="block text-sm text-text-secondary mb-1">
        About The Job
      </label>
      <textarea
        value={about}
        onChange={(e) => {
          setAbout(e.target.value);
          setErrors((s) => ({ ...s, about: undefined }));
        }}
        placeholder="e.g. A brief description of the job"
        className="border p-2 rounded"
      />
      {errors.about && <div className="text-sm text-error">{errors.about}</div>}

      <label className="block text-sm text-text-secondary mb-1">
        Job Descriptions
      </label>
      <ArrayInput
        value={descriptions}
        onChange={(v) => {
          setDescriptions(v);
          setErrors((s) => ({ ...s, descriptions: undefined }));
        }}
        placeholder="e.g. Key responsibilities and duties"
      />
      {errors.descriptions && (
        <div className="text-sm text-error">{errors.descriptions}</div>
      )}

      <label className="block text-sm text-text-secondary mb-1">
        Job Requirements
      </label>
      <ArrayInput
        value={requirements}
        onChange={(v) => {
          setRequirements(v);
          setErrors((s) => ({ ...s, requirements: undefined }));
        }}
        placeholder="e.g. Required skills and qualifications"
      />
      {errors.requirements && (
        <div className="text-sm text-error">{errors.requirements}</div>
      )}

      <label className="block text-sm text-text-secondary mb-1">
        Additional Info
      </label>
      <ArrayInput
        value={additional_info}
        onChange={(v) => {
          setAdditionalInfo(v);
          setErrors((s) => ({ ...s, additional_info: undefined }));
        }}
        placeholder="Additional info item"
      />

      <label className="block text-sm text-text-secondary mb-1">
        Employment Type
      </label>
      <select
        value={employment_type}
        onChange={(e) => {
          setEmploymentType(e.target.value);
          setErrors((s) => ({ ...s, employment_type: undefined }));
        }}
        className="border p-2 rounded"
      >
        <option value="">Select employment type</option>
        {employmentList.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors.employment_type && (
        <div className="text-sm text-error">{errors.employment_type}</div>
      )}

      <label className="block text-sm text-text-secondary mb-1">Location</label>
      <select
        value={location}
        onChange={(e) => {
          setLocation(e.target.value);
          setErrors((s) => ({ ...s, location: undefined }));
        }}
        className="border p-2 rounded"
      >
        <option value="">Select location</option>
        {locationList.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors.location && (
        <div className="text-sm text-error">{errors.location}</div>
      )}

      {/* status select - rendered when editing (initial.status exists) or when parent passes initial with status */}
      {initial.status !== undefined && (
        <>
          <label className="block text-sm text-text-secondary mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setErrors((s) => ({ ...s, status: undefined }));
            }}
            className="border p-2 rounded"
          >
            <option value="">Select status</option>
            {defaultStatusList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && (
            <div className="text-sm text-error">{errors.status}</div>
          )}
        </>
      )}

      <div className="flex gap-2">
        <FormInput
          label="Min salary"
          value={min_salary}
          onChange={(e) => {
            setMinSalary(e.target.value);
            setErrors((s) => ({ ...s, min_salary: undefined }));
          }}
          placeholder="e.g. 5000000"
        />
        <FormInput
          label="Max salary"
          value={max_salary}
          onChange={(e) => {
            setMaxSalary(e.target.value);
            setErrors((s) => ({ ...s, max_salary: undefined }));
          }}
          placeholder="e.g. 10000000"
        />
        {(errors.min_salary || errors.max_salary) && (
          <div className="text-sm text-error">
            {errors.min_salary || errors.max_salary}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1 bg-success hover:bg-emerald-700 text-white rounded disabled:opacity-60"
        >
          {submitting ? 'Memproses...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
