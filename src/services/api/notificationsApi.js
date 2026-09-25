import { http } from './httpClient';

// Always scoped to the logged-in user server-side (req.user.id) — there's
// no id/filter to pass in.
export async function getMyNotifications() {
  return http.get('/notifications');
}

export async function markNotificationAsRead(id) {
  return http.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead() {
  return http.patch('/notifications/read-all');
}

export async function deleteNotification(id) {
  return http.delete(`/notifications/${id}`);
}
