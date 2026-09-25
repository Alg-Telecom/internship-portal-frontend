import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as documentRequestsApi from '../services/api/documentRequestsApi';
import * as documentsApi from '../services/api/documentsApi';

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

function invalidateDocumentRequests(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['documentRequests'] });
  queryClient.invalidateQueries({ queryKey: ['documentRequest'] });
}

export function useCreateDocumentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => documentRequestsApi.createDocumentRequest(data),
    onSuccess: () => invalidateDocumentRequests(queryClient),
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, ...upload }) => documentRequestsApi.uploadDocument(requestId, upload),
    onSuccess: () => invalidateDocumentRequests(queryClient),
  });
}

export function useApproveDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => documentsApi.approveDocument(documentId),
    onSuccess: () => invalidateDocumentRequests(queryClient),
  });
}

export function useRejectDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, rejectionReason }) => documentsApi.rejectDocument(documentId, rejectionReason),
    onSuccess: () => invalidateDocumentRequests(queryClient),
  });
}
