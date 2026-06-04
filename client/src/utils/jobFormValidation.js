// Validation and normalization helpers for JobForm
const EMPLOYMENT = ['full-time', 'part-time', 'contract', 'internship'];
const LOCATIONS = ['onsite', 'remote', 'hybrid'];
const STATUS = ['draft', 'open', 'closed'];

function trimStr(v) {
  return typeof v === 'string' ? v.trim() : v;
}

function normalizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((it) => (typeof it === 'string' ? it.trim() : it))
    .filter(Boolean);
}

export function normalizeJobForm(values = {}) {
  const normalized = {
    title: trimStr(values.title || ''),
    about: trimStr(values.about || ''),
    descriptions: normalizeArray(values.descriptions || []),
    requirements: normalizeArray(values.requirements || []),
    additional_info: normalizeArray(values.additional_info || []),
    employment_type: trimStr(values.employment_type || ''),
    location: trimStr(values.location || ''),
    status: trimStr(values.status || ''),
  };

  // Salary: convert to number when present and valid, else undefined
  const minRaw = values.min_salary;
  const maxRaw = values.max_salary;

  const minNum = minRaw === '' || minRaw == null ? null : Number(minRaw);
  const maxNum = maxRaw === '' || maxRaw == null ? null : Number(maxRaw);

  if (minNum != null && !Number.isNaN(minNum)) normalized.min_salary = minNum;
  if (maxNum != null && !Number.isNaN(maxNum)) normalized.max_salary = maxNum;

  return normalized;
}

export function validateJobForm(values = {}, opts = { requireStatus: false }) {
  const errors = {};
  const v = values;

  if (!v.title || v.title.length === 0) errors.title = 'Title wajib diisi';
  if (!v.about || v.about.length === 0) errors.about = 'About wajib diisi';

  if (!Array.isArray(v.descriptions) || v.descriptions.length === 0)
    errors.descriptions = 'Deskripsi minimal 1 item';

  if (!Array.isArray(v.requirements) || v.requirements.length === 0)
    errors.requirements = 'Requirement minimal 1 item';

  if (!v.employment_type || !EMPLOYMENT.includes(v.employment_type))
    errors.employment_type = 'Employment type tidak valid';

  if (!v.location || !LOCATIONS.includes(v.location))
    errors.location = 'Location tidak valid';

  if (opts.requireStatus) {
    if (!v.status || !STATUS.includes(v.status))
      errors.status = 'Status tidak valid';
  } else if (v.status) {
    if (!STATUS.includes(v.status)) errors.status = 'Status tidak valid';
  }

  const hasMin = v.min_salary != null;
  const hasMax = v.max_salary != null;

  if (hasMin && !hasMax) {
    errors.min_salary = 'Jika mengisi Min salary, Max salary harus diisi juga';
    errors.max_salary = 'Jika mengisi Min salary, Max salary harus diisi juga';
  }

  if (!errors.min_salary && !errors.max_salary && hasMin && hasMax) {
    if (typeof v.min_salary !== 'number' || v.min_salary < 0)
      errors.min_salary = 'Min salary harus berupa angka >= 0';
    if (typeof v.max_salary !== 'number' || v.max_salary < 0)
      errors.max_salary = 'Max salary harus berupa angka >= 0';
    if (!errors.min_salary && !errors.max_salary && v.min_salary > v.max_salary)
      errors.min_salary = 'Min salary harus <= Max salary';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export default { normalizeJobForm, validateJobForm };
