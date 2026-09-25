import { useParams, Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useApplication, useAcceptApplication, useRejectApplication, useCancelApplication } from '../../hooks/useApplications';
import { useToast } from '../../context/ToastContext';
import { SkeletonRows } from '../../components/ui/Skeleton';
import CandidateProfileSummary from './components/CandidateProfileSummary';
import CandidateDocumentsList from './components/CandidateDocumentsList';
import ApplicationDecisionBar from './components/ApplicationDecisionBar';
import { useLanguage } from '../../context/LanguageContext';

export default function ApplicationReviewPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.review.title'));
  const { id } = useParams();
  const { showToast } = useToast();
  const { application, refetch } = useApplication(id);
  const acceptApplication = useAcceptApplication();
  const rejectApplication = useRejectApplication();
  const cancelApplication = useCancelApplication();

  async function handleAccept(teamId) {
    await acceptApplication.mutateAsync({ id, teamId });
    showToast(t('admin.review.accepted'));
  }

  async function handleReject(rejectionReason) {
    await rejectApplication.mutateAsync({ id, rejectionReason });
    showToast(t('admin.review.rejected'), { type: 'info' });
  }

  async function handleCancel() {
    await cancelApplication.mutateAsync(id);
    showToast(t('admin.review.cancelled'), { type: 'info' });
  }

  if (!application) {
    return <SkeletonRows rows={6} />;
  }

  return (
    <div className="flex flex-col gap-5 pb-24">
      <Link to="/admin/applications" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <CaretLeft className="h-4 w-4" aria-hidden="true" />
        {t('admin.review.backToApplications')}
      </Link>
      <CandidateProfileSummary application={application} />
      <CandidateDocumentsList application={application} onChanged={refetch} />
      <ApplicationDecisionBar application={application} onAccept={handleAccept} onReject={handleReject} onCancel={handleCancel} />
    </div>
  );
}
