import { useAsync } from './useAsync';
import * as usersApi from '../services/mockApi/usersApi';

export function useUsers(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useAsync(() => usersApi.listUsers(filters), [key]);
  return { users: data || [], isLoading, error, refetch };
}

export function useInterns(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useAsync(() => usersApi.listInterns(filters), [key]);
  return { interns: data || [], isLoading, error, refetch };
}

export function useSupervisors() {
  const { data, isLoading, error, refetch } = useAsync(() => usersApi.listSupervisors(), []);
  return { supervisors: data || [], isLoading, error, refetch };
}
