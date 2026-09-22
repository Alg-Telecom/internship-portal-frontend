import { useParams, Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useApplication } from '../../hooks/useApplications';
import { useToast } from '../../context/ToastContext';
import { SkeletonRows } from '../../components/ui/Skeleton';
import CandidateProfileSummary from './components/CandidateProfileSummary';
import CandidateDocumentsList from './components/CandidateDocumentsList';
import ApplicationDecisionBar from './components/ApplicationDecisionBar';
import * as applicationsApi from '../../services/api/applicationsApi';
import { useLanguage } from '../../context/LanguageContext';

export default function ApplicationReviewPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.review.title'));
  const { id } = useParams();
  const { showToast } = useToast();
  const { application, refetch } = useApplication(id);

  async function handleAccept(teamId) {
    await applicationsApi.acceptApplication(id, teamId);
    showToast(t('admin.review.accepted'));
    refetch();
  }

  async function handleReject(rejectionReason) {
    await applicationsApi.rejectApplication(id, rejectionReason);
    showToast(t('admin.review.rejected'), { type: 'info' });
    refetch();
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
      <ApplicationDecisionBar application={application} onAccept={handleAccept} onReject={handleReject} />
    </div>
  );
}
