import { useQuery } from '@tanstack/react-query';
import * as assignmentsApi from '../services/api/assignmentsApi';

export function useAssignments(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assignments', key],
    queryFn: () => assignmentsApi.getAssignments(filters),
  });
  return { assignments: data || [], isLoading, error, refetch };
}

export function useAssignment(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentsApi.getAssignment(id),
    enabled: !!id,
  });
  return { assignment: data, isLoading, error, refetch };
}
