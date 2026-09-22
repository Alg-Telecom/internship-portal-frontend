import { http, resolveFileUrl } from './httpClient';

function resolveDocumentUrls(document) {
  if (!document) return document;
  return { ...document, fileUrl: resolveFileUrl(document.fileUrl) };
}

function resolveRequestUrls(request) {
  if (!request) return request;
  return {
    ...request,
    documents: (request.documents || []).map(resolveDocumentUrls),
  };
}

// filters: { internId, status } — optional. A non-admin only ever sees
// their own requests regardless of what's passed (enforced server-side).
export async function getDocumentRequests(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  const requests = await http.get(`/document-requests${query}`);
  return requests.map(resolveRequestUrls);
}

export async function getDocumentRequest(id) {
  const request = await http.get(`/document-requests/${id}`);
  return resolveRequestUrls(request);
}

// data: { internId, title, description, deadline } — admin only.
export async function createDocumentRequest(data) {
  const request = await http.post('/document-requests', data);
  return resolveRequestUrls(request);
}

// Intern uploads a document against one of their requests: a single File
// object plus the required documentType string.
export async function uploadDocument(requestId, file, documentType) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);
  const document = await http.post(`/document-requests/${requestId}/documents`, formData, {
    isFormData: true,
  });
  return resolveDocumentUrls(document);
}
