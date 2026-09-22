import { useQuery } from '@tanstack/react-query';
import * as teamsApi from '../services/api/teamsApi';

export function useTeams() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamsApi.getTeams(),
  });
  return { teams: data || [], isLoading, error, refetch };
}

export function useTeam(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsApi.getTeam(id),
    enabled: !!id,
  });
  return { team: data, isLoading, error, refetch };
}
