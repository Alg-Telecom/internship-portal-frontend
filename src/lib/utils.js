import clsx from 'clsx';


export function cn(...inputs) {
  return clsx(...inputs);
}

export function formatDate(value, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', options);
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/**
 * Local-timezone `yyyy-mm-dd`, matching the ISO date strings used across
 * the mock API. `date.toISOString()` converts to UTC first, which can shift
 * the calendar day by one depending on the viewer's timezone offset — this
 * reads the date's own local year/month/day instead.
 */
export function toDateInputValue(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Reads a File into a base64 data: URL. Used instead of
 * `URL.createObjectURL()` for anything that needs to stay openable after
 * this tab session ends: an object URL only lives as long as the document
 * that created it, so it silently breaks (the "document" link errors out)
 * the moment the page reloads, a new tab opens it, or someone logs back in
 * later — since these mock uploads are persisted to localStorage as plain
 * strings, only a self-contained data URL survives that round-trip.
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}

export function initials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
}

export function fullName(user) {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`;
}
