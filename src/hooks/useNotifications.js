import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsApi.markNotificationAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllNotificationsAsRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationsApi.deleteNotification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
