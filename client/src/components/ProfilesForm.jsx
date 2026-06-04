import React, { useEffect, useState } from 'react';
import FormInput from './FormInput';
import { getMyProfile, updateMyProfile } from '../services/profiles';

export default function ProfilesForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    province: '',
    bio: '',
    linkedin_url: '',
    portfolio_url: '',
    birth_date: '',
    gender: '',
  });
  const [initialForm, setInitialForm] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getMyProfile();
        if (!mounted) return;
        const u = data?.user || {};
        const p = data?.profile || {};
        const loaded = {
          fullName: u.fullName || '',
          email: u.email || '',
          phone: p.phone || '',
          city: p.city || '',
          province: p.province || '',
          bio: p.bio || '',
          linkedin_url: p.linkedin_url || '',
          portfolio_url: p.portfolio_url || '',
          birth_date: p.birth_date ? p.birth_date.split('T')[0] : '',
          gender: p.gender || '',
        };
        setForm(loaded);
        setInitialForm(loaded);
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        city: form.city,
        province: form.province,
        bio: form.bio,
        linkedin_url: form.linkedin_url,
        portfolio_url: form.portfolio_url,
        birth_date: form.birth_date,
        gender: form.gender,
      };
      await updateMyProfile(payload);
      setSuccess('Profile updated successfully');
      // reset initial state so form is not dirty anymore
      setInitialForm((s) => ({ ...s, ...payload, email: form.email }));
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading profile...</div>;

  const isDirty =
    !!initialForm && JSON.stringify(initialForm) !== JSON.stringify(form);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-sm text-error">{error}</div>}
      {success && <div className="text-sm text-success">{success}</div>}
      {isDirty && <div className="text-sm text-warning">Unsaved changes</div>}

      <FormInput
        label="Full name"
        name="fullName"
        value={form.fullName}
        onChange={onChange}
        placeholder="Budi Siregar"
        required
      />

      <div>
        <label className="block text-sm text-text-secondary mb-1">Email</label>
        <div className="px-3 py-2 border border-border rounded bg-zinc-200 text-text-primary">
          {form.email}
        </div>
      </div>

      <FormInput
        label="Phone"
        name="phone"
        value={form.phone}
        onChange={onChange}
        placeholder="628xxxxxxxxx"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <FormInput
          label="City"
          name="city"
          value={form.city}
          onChange={onChange}
          placeholder="Jakarta Utara"
          required
        />
        <FormInput
          label="Province"
          name="province"
          value={form.province}
          onChange={onChange}
          placeholder="DKI Jakarta"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-text-secondary mb-1">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={onChange}
          className="w-full px-3 py-2 border border-border rounded bg-white text-text-primary"
          rows={4}
          placeholder="Short bio (max 500 chars)"
        />
      </div>

      <FormInput
        label="LinkedIn URL"
        name="linkedin_url"
        value={form.linkedin_url}
        onChange={onChange}
        placeholder="https://linkedin.com/in/yourname"
      />
      <FormInput
        label="Portfolio URL"
        name="portfolio_url"
        value={form.portfolio_url}
        onChange={onChange}
        placeholder="your personal website or portfolio link"
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Birth date
          </label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={onChange}
            className="w-full px-3 py-2 border border-border rounded bg-white text-text-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="w-full px-3 py-2 border border-border rounded bg-white text-text-primary"
          >
            <option value="">Select gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!isDirty || saving}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
