import { getCollection, insert, update, delay } from './db';
import { currentMaxId } from './seed';

/** Internal helper used by other mockApi modules — not delayed on purpose. */
export function createNotification({ userId, title, message, notificationType }) {
  const id = currentMaxId('notifications') + 1;
  return insert('notifications', {
    id,
    userId,
    title,
    message,
    notificationType,
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
