import { useAsync } from './useAsync';
import * as teamsApi from '../services/mockApi/teamsApi';

export function useTeams() {
  const { data, isLoading, error, refetch } = useAsync(() => teamsApi.listTeams(), []);
  return { teams: data || [], isLoading, error, refetch };
}

export function useTeam(id) {
  const { data, isLoading, error, refetch } = useAsync(() => teamsApi.getTeam(id), [id]);
  return { team: data, isLoading, error, refetch };
}
