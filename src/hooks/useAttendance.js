import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as attendanceApi from '../services/api/attendanceApi';

export function useAttendance(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance', key],
    queryFn: () => attendanceApi.getAttendance(filters),
  });
  return { records: data || [], isLoading, error, refetch };
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => attendanceApi.markAttendance(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance'] }),
  });
}
