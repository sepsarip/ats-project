import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { normalizeJobForm, validateJobForm } from '../utils/jobFormValidation';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';

function ArrayInput({ value = [], onChange, placeholder }) {
  const add = () => onChange([...(value || []), '']);
  const setAt = (i, v) =>
    onChange(value.map((it, idx) => (idx === i ? v : it)));
  const removeAt = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2 mb-3">
      {(value || []).map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={it}
            onChange={(e) => setAt(i, e.target.value)}
            className="flex-1 border border-border/80 bg-background/50 px-3.5 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => removeAt(i)}
            title="Remove item"
            className="p-2 text-white bg-error hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors shadow-sm"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-lg transition-colors"
      >
        <FiPlus className="w-3.5 h-3.5" />
        <span>Add Item</span>
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
  const navigate = useNavigate();
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {submitError && (
        <div className="mb-2 text-error bg-error/10 border border-error/20 p-3 rounded-lg text-sm font-medium">
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
        inputClassName="border border-border/80 bg-background/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
      />

      <div>
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
          className="w-full border border-border/80 bg-background/50 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 min-h-[100px]"
        />
        {errors.about && <div className="text-sm text-error mt-1">{errors.about}</div>}
      </div>

      <div>
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
          <div className="text-sm text-error mt-1">{errors.descriptions}</div>
        )}
      </div>

      <div>
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
          <div className="text-sm text-error mt-1">{errors.requirements}</div>
        )}
      </div>

      <div>
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
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1">
          Employment Type
        </label>
        <select
          value={employment_type}
          onChange={(e) => {
            setEmploymentType(e.target.value);
            setErrors((s) => ({ ...s, employment_type: undefined }));
          }}
          className="w-full border border-border/80 bg-background/50 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-text-primary"
        >
          <option value="">Select employment type</option>
          {employmentList.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.employment_type && (
          <div className="text-sm text-error mt-1">{errors.employment_type}</div>
        )}
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1">Location</label>
        <select
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setErrors((s) => ({ ...s, location: undefined }));
          }}
          className="w-full border border-border/80 bg-background/50 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-text-primary"
        >
          <option value="">Select location</option>
          {locationList.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.location && (
          <div className="text-sm text-error mt-1">{errors.location}</div>
        )}
      </div>

      {initial.status !== undefined && (
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setErrors((s) => ({ ...s, status: undefined }));
            }}
            className="w-full border border-border/80 bg-background/50 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-text-primary"
          >
            <option value="">Select status</option>
            {defaultStatusList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && (
            <div className="text-sm text-error mt-1">{errors.status}</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Min salary"
          value={min_salary}
          onChange={(e) => {
            setMinSalary(e.target.value);
            setErrors((s) => ({ ...s, min_salary: undefined }));
          }}
          placeholder="e.g. 5000000"
          inputClassName="border border-border/80 bg-background/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        />
        <FormInput
          label="Max salary"
          value={max_salary}
          onChange={(e) => {
            setMaxSalary(e.target.value);
            setErrors((s) => ({ ...s, max_salary: undefined }));
          }}
          placeholder="e.g. 10000000"
          inputClassName="border border-border/80 bg-background/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        />
        {(errors.min_salary || errors.max_salary) && (
          <div className="text-sm text-error sm:col-span-2">
            {errors.min_salary || errors.max_salary}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6 pt-6 border-t border-border/60">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-success hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 disabled:opacity-60"
        >
          <FiSave className="w-4 h-4" />
          <span>{submitting ? 'Memproses...' : 'Save Job'}</span>
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-text-primary rounded-lg text-sm font-semibold transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
