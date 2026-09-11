import { useAsync } from './useAsync';
import * as assignmentsApi from '../services/mockApi/assignmentsApi';

export function useAssignments(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useAsync(() => assignmentsApi.listAssignments(filters), [key]);
  return { assignments: data || [], isLoading, error, refetch };
}

export function useAssignment(id) {
  const { data, isLoading, error, refetch } = useAsync(() => assignmentsApi.getAssignment(id), [id]);
  return { assignment: data, isLoading, error, refetch };
}
