import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '../services/api/usersApi';

export function useUsers(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', key],
    queryFn: () => usersApi.getUsers(filters.role),
  });
  return { users: data || [], isLoading, error, refetch };
}

// `interns` is ACTIVE interns only — what every list, count and "pick an
// intern" menu should show, since a deactivated intern has left. Use
// `allInterns` only to look up names on existing history (assignments,
// document requests, attendance) so records of a deactivated intern don't
// turn nameless. Inactive accounts are still managed from Admin > Users.
export function useInterns(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', 'intern', key],
    queryFn: async () => {
      const interns = await usersApi.getUsers('intern');
      return filters.teamId ? interns.filter((i) => i.teamId === Number(filters.teamId)) : interns;
    },
  });
  const allInterns = data || [];
  return { interns: allInterns.filter((i) => i.isActive !== false), allInterns, isLoading, error, refetch };
}

export function useSupervisors() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', 'supervisor'],
    queryFn: () => usersApi.getUsers('supervisor'),
  });
  return { supervisors: data || [], isLoading, error, refetch };
}

// Every list above shares the 'users' key prefix, so invalidating just
// ['users'] (without `exact`) refreshes all of them — the plain list, the
// intern-filtered one, and the supervisor one — after any write below.
// Create/update also invalidate 'teams', since a user's teamId (set here,
// not through the teams API) is what a team's own intern count is built
// from — see teamsApi.js's resolveTeamCounts.
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => usersApi.updateUser(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => usersApi.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateOwnProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => usersApi.updateOwnProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUploadOwnPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => usersApi.uploadOwnPhoto(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}

// No invalidation on success — the caller logs the user out right after
// (their session cookie is already cleared server-side), so there's no
// more session for a stale 'users' cache to matter to.
export function useDeactivateOwnAccount() {
  return useMutation({
    mutationFn: () => usersApi.deactivateOwnAccount(),
  });
}
