import { useParams, Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAssignment } from '../../hooks/useAssignments';
import { useToast } from '../../context/ToastContext';
import { SkeletonRows } from '../../components/ui/Skeleton';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import Badge from '../../components/ui/Badge';
import SubmitWorkForm from './components/SubmitWorkForm';
import FeedbackPanel from './components/FeedbackPanel';
import { formatDate } from '../../lib/utils';
import * as assignmentsApi from '../../services/mockApi/assignmentsApi';
import { useLanguage } from '../../context/LanguageContext';

const CAN_SUBMIT_STATUSES = ['Pending', 'InProgress', 'Late'];

export default function AssignmentDetailPage() {
  const { t } = useLanguage();
  usePageHeader(t('intern.assignments.details'));
  const { id } = useParams();
  const { showToast } = useToast();
  const { assignment, refetch } = useAssignment(id);

  async function handleSubmitWork({ fileName, fileUrl, notes }) {
    await assignmentsApi.submitWork(assignment.id, { fileName, fileUrl, notes });
    showToast(t('intern.assignments.submitted'));
    refetch();
  }

  if (!assignment) {
    return <SkeletonRows rows={5} />;
  }

  const canSubmit = CAN_SUBMIT_STATUSES.includes(assignment.status);

  return (
    <div className="flex flex-col gap-5">
      <Link to="/intern/assignments" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <CaretLeft className="h-4 w-4" aria-hidden="true" />
        {t('intern.assignments.backToAssignments')}
      </Link>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{assignment.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{t('intern.assignments.due', { date: formatDate(assignment.deadline) })}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{t(`common.priority.${assignment.priority}`)}</Badge>
            <StatusBadge status={assignment.status} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{assignment.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('intern.assignments.yourSubmission')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {assignment.submission && <FeedbackPanel submission={assignment.submission} />}
          {canSubmit && <SubmitWorkForm onSubmit={handleSubmitWork} />}
        </CardContent>
      </Card>
    </div>
  );
}
