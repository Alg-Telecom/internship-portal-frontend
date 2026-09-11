import { useAsync } from './useAsync';
import * as documentsApi from '../services/mockApi/documentsApi';

export function useDocumentRequests(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useAsync(() => documentsApi.listDocumentRequests(filters), [key]);
  return { requests: data || [], isLoading, error, refetch };
}

export function useDocumentRequest(id) {
  const { data, isLoading, error, refetch } = useAsync(() => documentsApi.getDocumentRequest(id), [id]);
  return { request: data, isLoading, error, refetch };
}
