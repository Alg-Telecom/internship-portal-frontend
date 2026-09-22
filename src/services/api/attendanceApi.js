import { http } from './httpClient';

// filters: { internId, from, to } — all optional. from/to are date strings
// (e.g. "2026-09-01"); a non-admin's own scope is enforced server-side.
export async function getAttendance(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  return http.get(`/attendance${query}`);
}

// data: { internId, date, status, arrivalTime?, departureTime?, remarks? }
// Marking the same intern on the same date again updates that day's record
// instead of creating a duplicate (the backend upserts on internId+date).
export async function markAttendance(data) {
  return http.post('/attendance', data);
}
