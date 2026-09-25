import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useDocumentRequests, useCreateDocumentRequest, useApproveDocument, useRejectDocument } from '../../hooks/useDocuments';
import { useInterns } from '../../hooks/useUsers';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DocumentRequestsTable from './components/DocumentRequestsTable';
import DocumentRequestFormDialog from './components/DocumentRequestFormDialog';
import { useLanguage } from '../../context/LanguageContext';

export default function DocumentRequestsPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.documentRequests.title'));
  const navigate = useNavigate();
  const { requests, isLoading } = useDocumentRequests();
  const { interns } = useInterns();
  const createDocumentRequest = useCreateDocumentRequest();
  const approveDocument = useApproveDocument();
  const rejectDocument = useRejectDocument();
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const internsById = Object.fromEntries(interns.map((i) => [i.id, i]));

  // The table (and the admin below) expect each row to carry a
  // `latestDocument` - the real backend only gives us the raw `documents`
  // array, so compute it here the same way the detail page does (highest
  // `version` wins).
  const requestsWithLatest = requests.map((request) => {
    const sorted = [...(request.documents || [])].sort((a, b) => b.version - a.version);
    return { ...request, latestDocument: sorted[0] || null };
  });

  async function handleCreate(values) {
    await createDocumentRequest.mutateAsync(values);
    showToast(t('admin.documentRequests.requestSent'));
  }

  async function handleApprove(documentId) {
    await approveDocument.mutateAsync(documentId);
    showToast(t('admin.documentRequests.approved'));
  }

  async function handleReject(documentId, reason) {
    await rejectDocument.mutateAsync({ documentId, rejectionReason: reason });
    showToast(t('admin.documentRequests.rejected'), { type: 'info' });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.documentRequests.title')}</CardTitle>
        <Button size="sm" onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('admin.documentRequests.newRequest')}
        </Button>
      </CardHeader>
      <DocumentRequestsTable
        requests={requestsWithLatest}
        isLoading={isLoading}
        internsById={internsById}
        onApprove={handleApprove}
        onReject={handleReject}
        onSelect={(row) => navigate(`/admin/document-requests/${row.id}`)}
      />
      <DocumentRequestFormDialog open={isCreating} onClose={() => setIsCreating(false)} onSubmit={handleCreate} />
    </Card>
  );
}
