import { useQuery } from '@tanstack/react-query';
import * as calendarEventsApi from '../services/api/calendarEventsApi';

export function useCalendarEvents() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['calendarEvents'],
    queryFn: () => calendarEventsApi.getCalendarEvents(),
  });
  return { events: data || [], isLoading, error, refetch };
}
