import { useQuery } from '@tanstack/react-query';
import * as usersApi from '../services/api/usersApi';

export function useUsers(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', key],
    queryFn: () => usersApi.getUsers(filters.role),
  });
  return { users: data || [], isLoading, error, refetch };
}

export function useInterns(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', 'intern', key],
    queryFn: async () => {
      const interns = await usersApi.getUsers('intern');
      return filters.teamId ? interns.filter((i) => i.teamId === Number(filters.teamId)) : interns;
    },
  });
  return { interns: data || [], isLoading, error, refetch };
}

export function useSupervisors() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', 'supervisor'],
    queryFn: () => usersApi.getUsers('supervisor'),
  });
  return { supervisors: data || [], isLoading, error, refetch };
}
