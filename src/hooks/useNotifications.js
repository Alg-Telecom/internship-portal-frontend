import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as notificationsApi from '../services/api/notificationsApi';
import { useAuth } from '../context/AuthContext';

export function useNotifications() {
  const { user } = useAuth();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => notificationsApi.getMyNotifications(),
    enabled: !!user,
  });
  const notifications = data || [];
  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);
  return { notifications, unreadCount, isLoading, refetch };
}
