import { getCollection, insert, update, delay } from './db';
import { currentMaxId } from './seed';

/**
 * Internal helper used by other mockApi modules — not delayed on purpose.
 * `link` is the in-app route the notification should open when clicked
 * (e.g. `/admin/applications/12`) — optional, since a few notification
 * types (document request/approval) only make sense pointing at a list.
 */
export function createNotification({ userId, title, message, notificationType, link = null }) {
  const id = currentMaxId('notifications') + 1;
  return insert('notifications', {
    id,
    userId,
    title,
    message,
    notificationType,
    link,
    creationDate: new Date().toISOString(),
    isRead: false,
  });
}

export async function listNotifications(userId) {
  await delay(150);
  return getCollection('notifications')
    .filter((n) => n.userId === userId)
    .sort((a, b) => (a.creationDate < b.creationDate ? 1 : -1));
}

export async function markAsRead(id) {
  await delay(100);
  return update('notifications', id, { isRead: true });
}

export async function markAllAsRead(userId) {
  await delay(150);
  const items = getCollection('notifications');
  items
    .filter((n) => n.userId === userId && !n.isRead)
    .forEach((n) => update('notifications', n.id, { isRead: true }));
}
