import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as calendarEventsApi from '../services/api/calendarEventsApi';

export function useCalendarEvents() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: () => calendarEventsApi.getCalendarEvents(),
  });
  return { events: data || [], isLoading, error, refetch };
}

export function useCreateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => calendarEventsApi.createCalendarEvent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendarEvents'] }),
  });
}

export function useUpdateCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => calendarEventsApi.updateCalendarEvent(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendarEvents'] }),
  });
}

export function useDeleteCalendarEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => calendarEventsApi.deleteCalendarEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendarEvents'] }),
  });
}
