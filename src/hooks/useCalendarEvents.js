import { useAsync } from './useAsync';
import * as calendarApi from '../services/mockApi/calendarApi';

export function useCalendarEvents() {
  const { data, isLoading, error, refetch } = useAsync(() => calendarApi.listEvents(), []);
  return { events: data || [], isLoading, error, refetch };
}
