import { DocumentRequestStatus, DocumentStatus } from '../../domain/enums';
import { getCollection, insert, update, findById, delay } from './db';
import { currentMaxId } from './seed';
import { createNotification } from './notificationsApi';
import { fileToDataUrl } from '../../lib/utils';

function attachDocuments(request) {
  const documents = getCollection('documents')
    .filter((d) => d.requestId === request.id)
    .sort((a, b) => b.version - a.version);
  return { ...request, documents, latestDocument: documents[0] || null };
}

export async function listDocumentRequests(filters = {}) {
  await delay();
  let items = getCollection('documentRequests');
  if (filters.internId) items = items.filter((r) => r.internId === Number(filters.internId));
  if (filters.status) items = items.filter((r) => r.status === filters.status);
  return items.map(attachDocuments).sort((a, b) => (a.requestDate < b.requestDate ? 1 : -1));
}

export async function getDocumentRequest(id) {
  await delay();
  const request = findById('documentRequests', Number(id));
  if (!request) throw new Error('Document request not found.');
  return attachDocuments(request);
}

export async function createDocumentRequest(data) {
  await delay(400);
  const id = currentMaxId('documentRequests') + 1;
  const request = { id, status: DocumentRequestStatus.PENDING, rejectionReason: '', requestDate: new Date().toISOString().slice(0, 10), ...data };
  insert('documentRequests', request);
  createNotification({
    userId: data.internId,
    titleKey: 'notifications.newDocumentRequest.title',
    messageKey: 'notifications.newDocumentRequest.message',
    params: { title: data.title },
    notificationType: 'Document',
    link: '/intern/documents',
  });
  return request;
}

/**
 * Accepts the raw `File` the intern picked and reads it into a base64
 * data: URL itself — the mock's equivalent of the real backend's multer
 * middleware saving the upload to disk and returning its URL (see
 * services/api/documentsApi.js#uploadDocument). `internId` is no longer a
 * required argument: it's read off the document request itself (the real
 * backend infers it from the logged-in intern's session instead).
 */
export async function uploadDocument(requestId, { file, documentType }) {
  await delay(500);
  const request = findById('documentRequests', Number(requestId));
  if (!request) throw new Error('Document request not found.');
  const previousVersions = getCollection('documents').filter((d) => d.requestId === Number(requestId));
  const id = currentMaxId('documents') + 1;
  const fileUrl = file ? await fileToDataUrl(file) : '';
  const document = {
    id,
    requestId: Number(requestId),
    internId: request.internId,
    fileName: file?.name || '',
    fileUrl,
    documentType,
    uploadDate: new Date().toISOString(),
    version: previousVersions.length + 1,
    status: DocumentStatus.PENDING,
    rejectionReason: '',
  };
  insert('documents', document);
  update('documentRequests', Number(requestId), { status: DocumentRequestStatus.SUBMITTED });

  createNotification({
    userId: request.adminId,
    titleKey: 'notifications.documentSubmitted.title',
    messageKey: 'notifications.documentSubmitted.message',
    params: { title: request.title },
    notificationType: 'Document',
    link: `/admin/document-requests/${request.id}`,
  });

  return document;
}

export async function approveDocument(documentId) {
  await delay(300);
  const document = update('documents', Number(documentId), { status: DocumentStatus.APPROVED, rejectionReason: '' });
  update('documentRequests', document.requestId, { status: DocumentRequestStatus.APPROVED });
  createNotification({
    userId: document.internId,
    titleKey: 'notifications.documentApproved.title',
    messageKey: 'notifications.documentApproved.message',
    params: { fileName: document.fileName },
    notificationType: 'Document',
    link: '/intern/documents',
  });
  return document;
}

export async function rejectDocument(documentId, rejectionReason) {
  await delay(300);
  const document = update('documents', Number(documentId), { status: DocumentStatus.REJECTED, rejectionReason });
  update('documentRequests', document.requestId, { status: DocumentRequestStatus.REJECTED, rejectionReason });
  createNotification({
    userId: document.internId,
    titleKey: 'notifications.documentRejected.title',
    messageKey: 'notifications.documentRejected.message',
    params: { fileName: document.fileName, reason: rejectionReason },
    notificationType: 'Document',
    link: '/intern/documents',
  });
  return document;
}
