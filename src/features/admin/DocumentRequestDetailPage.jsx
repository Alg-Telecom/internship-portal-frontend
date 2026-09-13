import { useParams, Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useDocumentRequest } from '../../hooks/useDocuments';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import { SkeletonRows } from '../../components/ui/Skeleton';
import StatusBadge from '../../components/shared/StatusBadge';
import DocumentVersionHistory from './components/DocumentVersionHistory';
import SubmittedDocumentPreview from './components/SubmittedDocumentPreview';
import { formatDate } from '../../lib/utils';
import * as documentsApi from '../../services/mockApi/documentsApi';

export default function DocumentRequestDetailPage() {
  usePageHeader('Document Request');
  const { id } = useParams();
  const { showToast } = useToast();
  const { request, isLoading, refetch } = useDocumentRequest(id);

  async function handleApprove() {
    await documentsApi.approveDocument(request.latestDocument.id);
    showToast('Document approved.');
    refetch();
  }

  async function handleReject(reason) {
    await documentsApi.rejectDocument(request.latestDocument.id, reason);
    showToast('Document rejected.', { type: 'info' });
    refetch();
  }

  if (isLoading || !request) {
    return <SkeletonRows rows={6} />;
  }

  return (
    <div className="flex flex-col gap-5 pb-24">
      <Link to="/admin/document-requests" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <CaretLeft className="h-4 w-4" aria-hidden="true" />
        Back to document requests
      </Link>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{request.title}</CardTitle>
            <p className="mt-0.5 text-sm text-muted-foreground">Deadline: {formatDate(request.deadline)}</p>
          </div>
          <StatusBadge status={request.status} />
        </CardHeader>
        {request.description && <p className="px-5 pb-5 text-sm text-foreground">{request.description}</p>}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{request.latestDocument?.status === 'Pending' ? 'Review latest submission' : 'Latest submission'}</CardTitle>
        </CardHeader>
        <div className="px-5 pb-5">
          <SubmittedDocumentPreview document={request.latestDocument} onApprove={handleApprove} onReject={handleReject} />
        </div>
      </Card>

      {request.documents.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous versions</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5">
            <DocumentVersionHistory documents={request.documents.slice(1)} />
          </div>
        </Card>
      )}
    </div>
  );
}
