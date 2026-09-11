import { useMemo } from 'react';
import { useAsync } from './useAsync';
import * as applicationsApi from '../services/mockApi/applicationsApi';

export function useApplications(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useAsync(() => applicationsApi.listApplications(filters), [key]);
  return { applications: data || [], isLoading, error, refetch };
}

export function useApplication(id) {
  const { data, isLoading, error, refetch } = useAsync(() => applicationsApi.getApplication(id), [id]);
  return { application: data, isLoading, error, refetch };
}

/** Convenience: applications still awaiting a decision. */
export function usePendingApplicationsCount() {
  const { applications } = useApplications();
  return useMemo(() => applications.filter((a) => a.status === 'Pending').length, [applications]);
}
