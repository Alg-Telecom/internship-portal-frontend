import { http, resolveFileUrl } from './httpClient';

function resolveDocumentUrls(document) {
  if (!document) return document;
  return { ...document, fileUrl: resolveFileUrl(document.fileUrl) };
}

export async function approveDocument(id) {
  const document = await http.patch(`/documents/${id}/approve`);
  return resolveDocumentUrls(document);
}

export async function rejectDocument(id, rejectionReason) {
  const document = await http.patch(`/documents/${id}/reject`, { rejectionReason });
  return resolveDocumentUrls(document);
}
