export function formatRupiah(value) {
  if (value === undefined || value === null || value === '') return '';
  const n = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (!Number.isFinite(n) || n === 0) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

export function formatSalaryRange(min, max) {
  const minStr = formatRupiah(min);
  const maxStr = formatRupiah(max);

  if (!minStr && !maxStr) return '';
  if (minStr && !maxStr) return minStr;
  if (!minStr && maxStr) return maxStr;
  if (minStr === maxStr) return minStr;
  return `${minStr} - ${maxStr}`;
}

export function formatFileSize(bytes) {
  if (bytes === undefined || bytes === null || bytes === '') return '';
  const n = Number(bytes);
  if (!Number.isFinite(n)) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatLongDate(input) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'long' });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return `${weekday}, ${day} ${month} ${year}, ${time}`;
}

export function formatShortDate(input) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export default {
  formatRupiah,
  formatSalaryRange,
  formatFileSize,
  formatLongDate,
  formatShortDate,
};
