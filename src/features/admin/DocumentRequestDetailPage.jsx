import { useParams, Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useDocumentRequest, useApproveDocument, useRejectDocument } from '../../hooks/useDocuments';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import { SkeletonRows } from '../../components/ui/Skeleton';
import StatusBadge from '../../components/shared/StatusBadge';
import DocumentVersionHistory from './components/DocumentVersionHistory';
import SubmittedDocumentPreview from './components/SubmittedDocumentPreview';
import { formatDate } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export default function DocumentRequestDetailPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.documentRequestDetail.title'));
  const { id } = useParams();
  const { showToast } = useToast();
  const { request } = useDocumentRequest(id);
  const approveDocument = useApproveDocument();
  const rejectDocument = useRejectDocument();

  // The real backend only returns `documents` (every uploaded version, in
  // whatever order Prisma gives them) - it doesn't compute a "latest" one
  // for us like the mock backend used to. Each document's own `version`
  // number (see backend/src/controllers/documentRequestsController.js)
  // tells us which is newest.
  const sortedDocuments = request ? [...request.documents].sort((a, b) => b.version - a.version) : [];
  const latestDocument = sortedDocuments[0] || null;
  const previousDocuments = sortedDocuments.slice(1);

  async function handleApprove() {
    await approveDocument.mutateAsync(latestDocument.id);
    showToast(t('admin.documentRequestDetail.approved'));
  }

  async function handleReject(reason) {
    await rejectDocument.mutateAsync({ documentId: latestDocument.id, rejectionReason: reason });
    showToast(t('admin.documentRequestDetail.rejected'), { type: 'info' });
  }

  if (!request) {
    return <SkeletonRows rows={6} />;
  }

  return (
    <div className="flex flex-col gap-5 pb-24">
      <Link to="/admin/document-requests" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <CaretLeft className="h-4 w-4" aria-hidden="true" />
        {t('admin.documentRequestDetail.backToRequests')}
      </Link>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{request.title}</CardTitle>
            <p className="mt-0.5 text-sm text-muted-foreground">{t('admin.documentRequestDetail.deadline', { date: formatDate(request.deadline) })}</p>
          </div>
          <StatusBadge status={request.status} />
        </CardHeader>
        {request.description && <p className="px-5 pb-5 text-sm text-foreground">{request.description}</p>}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{latestDocument?.status === 'Pending' ? t('admin.documentRequestDetail.reviewLatest') : t('admin.documentRequestDetail.latestSubmission')}</CardTitle>
        </CardHeader>
        <div className="px-5 pb-5">
          <SubmittedDocumentPreview document={latestDocument} onApprove={handleApprove} onReject={handleReject} />
        </div>
      </Card>

      {previousDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.documentRequestDetail.previousVersions')}</CardTitle>
          </CardHeader>
          <div className="px-5 pb-5">
            <DocumentVersionHistory documents={previousDocuments} />
          </div>
        </Card>
      )}
    </div>
  );
}
