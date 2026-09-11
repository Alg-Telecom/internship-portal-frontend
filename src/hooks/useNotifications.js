import { useMemo } from 'react';
import { useAsync } from './useAsync';
import * as notificationsApi from '../services/mockApi/notificationsApi';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useAsync(() => (user ? notificationsApi.listNotifications(user.id) : Promise.resolve([])), [user?.id]);
  const notifications = data || [];
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  return { notifications, unreadCount, isLoading, refetch };
}
