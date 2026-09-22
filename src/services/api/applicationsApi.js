import { http, resolveFileUrl } from './httpClient';

function resolveApplicationUrls(application) {
  if (!application) return application;
  return {
    ...application,
    cvFileUrl: resolveFileUrl(application.cvFileUrl),
    photoFileUrl: resolveFileUrl(application.photoFileUrl),
    agreementFileUrl: resolveFileUrl(application.agreementFileUrl),
    internshipRequestFileUrl: resolveFileUrl(application.internshipRequestFileUrl),
    otherDocuments: (application.otherDocuments || []).map((doc) => ({
      ...doc,
      fileUrl: resolveFileUrl(doc.fileUrl),
    })),
  };
}

export async function checkEmailExists(email) {
  return http.get(`/applications/check-email?email=${encodeURIComponent(email)}`);
}

export async function submitApplication(formData) {
  // formData must already be a FormData instance built by the caller —
  // it needs the file fields (cvFile, photoFile, agreementFile,
  // internshipRequestFile, otherDocuments[]) alongside the text fields.
  const application = await http.post('/applications', formData, { isFormData: true });
  return resolveApplicationUrls(application);
}

export async function getApplications(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const applications = await http.get(`/applications${query}`);
  return applications.map(resolveApplicationUrls);
}

export async function getApplication(id) {
  const application = await http.get(`/applications/${id}`);
  return resolveApplicationUrls(application);
}

export async function acceptApplication(id, teamId) {
  const application = await http.post(`/applications/${id}/accept`, teamId ? { teamId } : undefined);
  return resolveApplicationUrls(application);
}

export async function rejectApplication(id, rejectionReason, rejectedField) {
  const application = await http.post(`/applications/${id}/reject`, {
    rejectionReason,
    ...(rejectedField ? { rejectedField } : {}),
  });
  return resolveApplicationUrls(application);
}

// Approves ONE document on an application (CV, photo, agreement, or
// internship request) without deciding the whole application. field is
// one of: "cv" | "photo" | "agreement" | "internshipRequest".
export async function approveApplicationDocument(id, field) {
  const application = await http.post(`/applications/${id}/approve-document`, { field });
  return resolveApplicationUrls(application);
}
