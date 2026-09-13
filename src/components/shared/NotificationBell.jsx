import { Popover } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { Bell, BellSimple } from '@phosphor-icons/react';
import { useNotifications } from '../../hooks/useNotifications';
import * as notificationsApi from '../../services/mockApi/notificationsApi';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime, cn } from '../../lib/utils';
import EmptyState from './EmptyState';

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, refetch } = useNotifications();

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
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        className="relative cursor-pointer rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" aria-hidden="true" />
        )}
      </Popover.Button>
      <Popover.Panel className="absolute right-0 z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-card shadow-popover sm:w-80">
        {({ close }) => (
          <>
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="cursor-pointer text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <EmptyState icon={BellSimple} title="You're all caught up" description="New notifications will show up here." />
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
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
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
