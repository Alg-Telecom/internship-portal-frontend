import { useEffect } from 'react';
import { Popover } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellSimple, X } from '@phosphor-icons/react';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '../../hooks/useNotifications';
import { formatDateTime, cn } from '../../lib/utils';
import EmptyState from './EmptyState';
import { useLanguage } from '../../context/LanguageContext';
import { useTeams } from '../../hooks/useTeams';

export default function NotificationBell() {
  const { t, tTeam } = useLanguage();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useNotifications();
  const markNotificationAsRead = useMarkNotificationAsRead();
  const markAllNotificationsAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();
  const { teams } = useTeams();
  const teamsByName = Object.fromEntries(teams.map((team) => [team.name, team]));

  // Notification params captured at creation time (see notificationsApi.js)
  // carry a raw team name — resolve it against the live team record (so a
  // rename since the notification was created still shows up) and
  // translate now, at render time, rather than when the notification was
  // created, same reasoning as titleKey/messageKey themselves.
  function renderParams(params) {
    if (!params) return params;
    const next = { ...params };
    if (next.team) next.team = tTeam(teamsByName[next.team] || next.team);
    if (next.preferredTeam) next.preferredTeam = tTeam(teamsByName[next.preferredTeam] || next.preferredTeam);
    return next;
  }

  async function handleMarkAllRead() {
    await markAllNotificationsAsRead.mutateAsync();
  }

  // Opens the page the notification is about (if any) and marks it read —
  // a notification that isn't clickable anywhere just reads as broken.
  async function handleSelect(notification, closePopover) {
    closePopover();
    if (!notification.isRead) {
      await markNotificationAsRead.mutateAsync(notification.id);
    }
    if (notification.link) navigate(notification.link);
  }

  // Deliberately not wrapped in a confirm dialog — deleting a
  // notification has no real consequence (it's just clearing an already-
  // read alert out of the list), so a confirmation step would just be
  // friction for something reversible-in-spirit (the underlying event,
  // e.g. an assignment, isn't affected).
  async function handleDelete(event, notification) {
    event.stopPropagation();
    await deleteNotification.mutateAsync(notification.id);
  }

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          {/* Clears the red dot as soon as the panel is opened and viewed -
              no extra "mark all read" click required. The explicit button
              below still exists for closing the panel without opening/
              reading each one (e.g. dismissing from a glance at the list). */}
          <MarkAllReadOnOpen open={open} hasUnread={unreadCount > 0} onMarkAllRead={handleMarkAllRead} />
          <Popover.Button
            aria-label={t('common.notifications.ariaLabel', { unread: unreadCount ? t('common.notifications.ariaUnread', { count: unreadCount }) : '' })}
            className="relative cursor-pointer rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" aria-hidden="true" />
            )}
          </Popover.Button>
          <Popover.Panel className="absolute end-0 z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-card shadow-popover sm:w-80">
            {({ close }) => (
              <>
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">{t('common.notifications.title')}</p>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="cursor-pointer text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      {t('common.notifications.markAllRead')}
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <EmptyState icon={BellSimple} title={t('common.notifications.empty')} description={t('common.notifications.emptyDescription')} />
                  ) : (
                    <ul>
                      {notifications.map((n) => (
                        <li key={n.id} className={cn('flex items-start border-b border-border last:border-b-0', !n.isRead && 'bg-primary/5')}>
                          <button
                            type="button"
                            onClick={() => handleSelect(n, close)}
                            className="min-w-0 flex-1 cursor-pointer px-4 py-3 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                          >
                            <p className="text-sm font-medium text-foreground">{n.titleKey ? t(n.titleKey) : n.title}</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">{n.messageKey ? t(n.messageKey, renderParams(n.params)) : n.message}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.creationDate)}</p>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, n)}
                            aria-label={t('common.delete')}
                            className="me-2 mt-2.5 shrink-0 cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}

/** Fires `onMarkAllRead` once, the moment the panel transitions to open, if there's anything unread. */
function MarkAllReadOnOpen({ open, hasUnread, onMarkAllRead }) {
  useEffect(() => {
    if (open && hasUnread) onMarkAllRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return null;
}
