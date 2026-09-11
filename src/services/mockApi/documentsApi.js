import { DocumentRequestStatus, DocumentStatus } from '../../domain/enums';
import { getCollection, insert, update, findById, delay } from './db';
import { currentMaxId } from './seed';
import { createNotification } from './notificationsApi';

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
    title: 'New document request',
    message: `A new document has been requested: "${data.title}".`,
    notificationType: 'Document',
  });
  return request;
}

export async function uploadDocument(requestId, { fileName, fileUrl, documentType, internId }) {
  await delay(500);
  const request = findById('documentRequests', Number(requestId));
  const previousVersions = getCollection('documents').filter((d) => d.requestId === Number(requestId));
  const id = currentMaxId('documents') + 1;
  const document = {
    id,
    requestId: Number(requestId),
    internId,
    fileName,
    // Object URL for this tab session only — see components/shared/DocumentLink.
    fileUrl: fileUrl || '',
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
    title: 'Document submitted',
    message: `A document was submitted for request "${request.title}".`,
    notificationType: 'Document',
  });

  return document;
}

export async function approveDocument(documentId) {
  await delay(300);
  const document = update('documents', Number(documentId), { status: DocumentStatus.APPROVED, rejectionReason: '' });
  update('documentRequests', document.requestId, { status: DocumentRequestStatus.APPROVED });
  createNotification({
    userId: document.internId,
    title: 'Document approved',
    message: `Your document "${document.fileName}" was approved.`,
    notificationType: 'Document',
  });
  return document;
}

export async function rejectDocument(documentId, rejectionReason) {
  await delay(300);
  const document = update('documents', Number(documentId), { status: DocumentStatus.REJECTED, rejectionReason });
  update('documentRequests', document.requestId, { status: DocumentRequestStatus.REJECTED, rejectionReason });
  createNotification({
    userId: document.internId,
    title: 'Document rejected',
    message: `Your document "${document.fileName}" was rejected: ${rejectionReason}`,
    notificationType: 'Document',
  });
  return document;
}
