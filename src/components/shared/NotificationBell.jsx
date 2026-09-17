import { Popover } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellSimple } from '@phosphor-icons/react';
import { useNotifications } from '../../hooks/useNotifications';
import * as notificationsApi from '../../services/mockApi/notificationsApi';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime, cn } from '../../lib/utils';
import EmptyState from './EmptyState';
import { useLanguage } from '../../context/LanguageContext';
import { useTeams } from '../../hooks/useTeams';

export default function NotificationBell() {
  const { t, tTeam } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, refetch } = useNotifications();
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
    await notificationsApi.markAllAsRead(user.id);
    refetch();
  }

  // Opens the page the notification is about (if any) and marks it read —
  // a notification that isn't clickable anywhere just reads as broken.
  async function handleSelect(notification, closePopover) {
    closePopover();
    if (!notification.isRead) {
      await notificationsApi.markAsRead(notification.id);
      refetch();
    }
    if (notification.link) navigate(notification.link);
  }

  return (
    <Popover className="relative">
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
                    <li key={n.id} className="border-b border-border last:border-b-0">
                      <button
                        type="button"
                        onClick={() => handleSelect(n, close)}
                        className={cn(
                          'w-full cursor-pointer px-4 py-3 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                          !n.isRead && 'bg-primary/5'
                        )}
                      >
                        <p className="text-sm font-medium text-foreground">{n.titleKey ? t(n.titleKey) : n.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.messageKey ? t(n.messageKey, renderParams(n.params)) : n.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.creationDate)}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </Popover.Panel>
    </Popover>
  );
}
