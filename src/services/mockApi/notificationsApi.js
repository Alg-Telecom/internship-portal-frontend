import { getCollection, insert, update, delay } from './db';
import { currentMaxId } from './seed';

/**
 * Internal helper used by other mockApi modules — not delayed on purpose.
 * `link` is the in-app route the notification should open when clicked
 * (e.g. `/admin/applications/12`) — optional, since a few notification
 * types (document request/approval) only make sense pointing at a list.
 *
 * `titleKey`/`messageKey` (translations.js dot-paths) + `params` are stored
 * instead of pre-rendered English text, so NotificationBell can render the
 * notification in whichever language is active when it's actually viewed —
 * rendering the text once at creation time would freeze it in whatever
 * language happened to be active at that moment, for every future viewer.
 */
export function createNotification({ userId, titleKey, messageKey, params = {}, notificationType, link = null }) {
  const id = currentMaxId('notifications') + 1;
  return insert('notifications', {
    id,
    userId,
    titleKey,
    messageKey,
    params,
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
