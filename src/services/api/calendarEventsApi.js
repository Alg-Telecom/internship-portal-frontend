import { http } from './httpClient';

export async function getCalendarEvents() {
  return http.get('/calendar-events');
}

// data: { title, date, type } — all required, admin only.
export async function createCalendarEvent(data) {
  return http.post('/calendar-events', data);
}

export async function updateCalendarEvent(id, patch) {
  return http.patch(`/calendar-events/${id}`, patch);
}

export async function deleteCalendarEvent(id) {
  await http.delete(`/calendar-events/${id}`);
  return true;
}
