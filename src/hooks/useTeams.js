import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as teamsApi from '../services/api/teamsApi';

export function useTeams() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.getTeams(),
  });
  return { teams: data || [], isLoading, error, refetch };
}

// For the public application form — no login yet, so this hits the
// unauthenticated /teams/public endpoint instead of /teams.
export function usePublicTeams() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['publicTeams'],
    queryFn: () => teamsApi.getPublicTeams(),
  });
  return { teams: data || [], isLoading, error };
}

export function useTeam(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsApi.getTeam(id),
    enabled: !!id,
  });
  return { team: data, isLoading, error, refetch };
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => teamsApi.createTeam(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => teamsApi.updateTeam(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  });
}
