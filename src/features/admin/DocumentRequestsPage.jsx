import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useDocumentRequests } from '../../hooks/useDocuments';
import { useInterns } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DocumentRequestsTable from './components/DocumentRequestsTable';
import DocumentRequestFormDialog from './components/DocumentRequestFormDialog';
import * as documentsApi from '../../services/mockApi/documentsApi';
import { useLanguage } from '../../context/LanguageContext';

export default function DocumentRequestsPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.documentRequests.title'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests, isLoading, refetch } = useDocumentRequests();
  const { interns } = useInterns();
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const internsById = Object.fromEntries(interns.map((i) => [i.id, i]));

  async function handleCreate(values) {
    await documentsApi.createDocumentRequest({ ...values, adminId: user.id });
    showToast(t('admin.documentRequests.requestSent'));
    refetch();
  }

  async function handleApprove(documentId) {
    await documentsApi.approveDocument(documentId);
    showToast(t('admin.documentRequests.approved'));
    refetch();
  }

  async function handleReject(documentId, reason) {
    await documentsApi.rejectDocument(documentId, reason);
    showToast(t('admin.documentRequests.rejected'), { type: 'info' });
    refetch();
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
        requests={requests}
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
