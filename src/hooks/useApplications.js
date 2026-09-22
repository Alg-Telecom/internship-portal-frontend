import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as applicationsApi from '../services/api/applicationsApi';

export function useApplications(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['applications', key],
    queryFn: () => applicationsApi.getApplications(filters.status),
  });
  return { applications: data || [], isLoading, error, refetch };
}

export function useApplication(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsApi.getApplication(id),
    enabled: !!id,
  });
  return { application: data, isLoading, error, refetch };
}

/** Convenience: applications still awaiting a decision. */
export function usePendingApplicationsCount() {
  const { applications } = useApplications();
  return useMemo(() => applications.filter((a) => a.status === 'Pending').length, [applications]);
}
