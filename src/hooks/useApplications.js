import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as applicationsApi from "../services/api/applicationsApi";

export function useApplications(filters = {}) {
  const key = JSON.stringify(filters);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["applications", key],
    queryFn: () => applicationsApi.getApplications(filters.status),
  });
  return { applications: data || [], isLoading, error, refetch };
}

export function useApplication(id) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationsApi.getApplication(id),
    enabled: !!id,
  });
  return { application: data, isLoading, error, refetch };
}

/** Convenience: applications still awaiting a decision. */
export function usePendingApplicationsCount() {
  const { applications } = useApplications();
  return useMemo(
    () => applications.filter((a) => a.status === "Pending").length,
    [applications],
  );
}

function invalidateApplications(queryClient) {
  queryClient.invalidateQueries({ queryKey: ["applications"] });
  queryClient.invalidateQueries({ queryKey: ["application"] });
}

export function useAcceptApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, teamId }) =>
      applicationsApi.acceptApplication(id, teamId),
    onSuccess: () => invalidateApplications(queryClient),
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejectionReason, rejectedField }) =>
      applicationsApi.rejectApplication(id, rejectionReason, rejectedField),
    onSuccess: () => invalidateApplications(queryClient),
  });
}

export function useApproveApplicationDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, field }) =>
      applicationsApi.approveApplicationDocument(id, field),
    onSuccess: () => invalidateApplications(queryClient),
  });
}

// Admin cancelling a still-pending application from ApplicationReviewPage.
export function useCancelApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => applicationsApi.cancelApplicationAsAdmin(id),
    onSuccess: () => invalidateApplications(queryClient),
  });
}

// Public — the applicant cancelling their own application by email, from
// CancelApplicationPage. No session to invalidate anything against.
export function useCancelOwnApplication() {
  return useMutation({
    mutationFn: ({ email, password }) =>
      applicationsApi.cancelOwnApplication(email, password),
  });
}
