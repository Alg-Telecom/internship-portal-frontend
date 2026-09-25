import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as assignmentsApi from '../services/api/assignmentsApi';
import * as submissionsApi from '../services/api/submissionsApi';

export function useAssignments(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assignments', key],
    queryFn: () => assignmentsApi.getAssignments(filters),
  });
  return { assignments: data || [], isLoading, error, refetch };
}

export function useAssignment(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentsApi.getAssignment(id),
    enabled: !!id,
  });
  return { assignment: data, isLoading, error, refetch };
}

function invalidateAssignments(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['assignments'] });
  queryClient.invalidateQueries({ queryKey: ['assignment'] });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => assignmentsApi.createAssignment(data),
    onSuccess: () => invalidateAssignments(queryClient),
  });
}

export function useUpdateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => assignmentsApi.updateAssignment(id, patch),
    onSuccess: () => invalidateAssignments(queryClient),
  });
}

export function useSubmitWork() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId, ...work }) => assignmentsApi.submitWork(assignmentId, work),
    onSuccess: () => invalidateAssignments(queryClient),
  });
}

// Evaluating a submission lives on its own route/controller on the real
// backend, but it changes what an assignment's detail page shows (grade,
// feedback, status), so it invalidates the same assignment keys.
export function useEvaluateSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, grade, feedback }) => submissionsApi.evaluateSubmission(submissionId, grade, feedback),
    onSuccess: () => invalidateAssignments(queryClient),
  });
}
