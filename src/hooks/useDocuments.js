import { useQuery } from '@tanstack/react-query';
import * as documentRequestsApi from '../services/api/documentRequestsApi';

export function useDocumentRequests(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['documentRequests', key],
    queryFn: () => documentRequestsApi.getDocumentRequests(filters),
  });
  return { requests: data || [], isLoading, error, refetch };
}

export function useDocumentRequest(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['documentRequest', id],
    queryFn: () => documentRequestsApi.getDocumentRequest(id),
    enabled: !!id,
  });
  return { request: data, isLoading, error, refetch };
}
