import { useParams, Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useApplication } from '../../hooks/useApplications';
import { useToast } from '../../context/ToastContext';
import { SkeletonRows } from '../../components/ui/Skeleton';
import CandidateProfileSummary from './components/CandidateProfileSummary';
import CandidateDocumentsList from './components/CandidateDocumentsList';
import ApplicationDecisionBar from './components/ApplicationDecisionBar';
import * as applicationsApi from '../../services/mockApi/applicationsApi';

export default function ApplicationReviewPage() {
  usePageHeader('Review Application');
  const { id } = useParams();
  const { showToast } = useToast();
  const { application, isLoading, refetch } = useApplication(id);

  async function handleAccept() {
    await applicationsApi.decideApplication(id, { status: 'Accepted' });
    showToast('Application accepted. The intern account has been created.');
    refetch();
  }

  async function handleReject(rejectionReason) {
    await applicationsApi.decideApplication(id, { status: 'Rejected', rejectionReason });
    showToast('Application rejected.', { type: 'info' });
    refetch();
  }

  if (isLoading || !application) {
    return <SkeletonRows rows={6} />;
  }

  return (
    <div className="flex flex-col gap-5 pb-24">
      <Link to="/admin/applications" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <CaretLeft className="h-4 w-4" aria-hidden="true" />
        Back to applications
      </Link>
      <CandidateProfileSummary application={application} />
      <CandidateDocumentsList application={application} onChanged={refetch} />
      <ApplicationDecisionBar application={application} onAccept={handleAccept} onReject={handleReject} />
    </div>
  );
}
