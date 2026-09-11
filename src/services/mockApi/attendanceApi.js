import { getCollection, insert, update, delay } from './db';
import { currentMaxId } from './seed';

export async function listAttendance(filters = {}) {
  await delay();
  let items = getCollection('attendance');
  if (filters.internId) items = items.filter((a) => a.internId === Number(filters.internId));
  if (filters.supervisorId) items = items.filter((a) => a.supervisorId === Number(filters.supervisorId));
  if (filters.month) items = items.filter((a) => a.date.startsWith(filters.month));
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Upserts a single day's attendance record for one intern. */
export async function recordAttendance({ internId, supervisorId, date, status, arrivalTime, departureTime, remarks }) {
  await delay(300);
  const items = getCollection('attendance');
  const existing = items.find((a) => a.internId === Number(internId) && a.date === date);
  if (existing) {
    return update('attendance', existing.id, { status, arrivalTime, departureTime, remarks });
  }
  const id = currentMaxId('attendance') + 1;
  return insert('attendance', {
    id,
    internId: Number(internId),
    supervisorId: Number(supervisorId),
    date,
    status,
    arrivalTime: arrivalTime || null,
    departureTime: departureTime || null,
    remarks: remarks || '',
  });
}
