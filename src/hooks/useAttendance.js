import { useAsync } from './useAsync';
import * as attendanceApi from '../services/mockApi/attendanceApi';

export function useAttendance(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useAsync(() => attendanceApi.listAttendance(filters), [key]);
  return { records: data || [], isLoading, error, refetch };
}
