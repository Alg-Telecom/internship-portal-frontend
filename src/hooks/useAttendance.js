import { useQuery } from '@tanstack/react-query';
import * as attendanceApi from '../services/api/attendanceApi';

export function useAttendance(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance', key],
    queryFn: () => attendanceApi.getAttendance(filters),
  });
  return { records: data || [], isLoading, error, refetch };
}
