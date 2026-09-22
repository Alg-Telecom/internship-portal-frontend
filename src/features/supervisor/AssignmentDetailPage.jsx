import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CaretLeft, PencilSimple } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAssignment } from '../../hooks/useAssignments';
import { useToast } from '../../context/ToastContext';
import { SkeletonRows } from '../../components/ui/Skeleton';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/shared/StatusBadge';
import Badge from '../../components/ui/Badge';
import SubmissionViewer from './components/SubmissionViewer';
import GradeForm from './components/GradeForm';
import AssignmentFormDialog from './components/AssignmentFormDialog';
import { formatDate } from '../../lib/utils';
import * as assignmentsApi from '../../services/api/assignmentsApi';
import * as submissionsApi from '../../services/api/submissionsApi';
import { useLanguage } from '../../context/LanguageContext';

export default function AssignmentDetailPage() {
  const { t } = useLanguage();
  usePageHeader(t('supervisor.assignments.details'));
  const { id } = useParams();
  const { showToast } = useToast();
  const { assignment, refetch } = useAssignment(id);
  const [isEditing, setIsEditing] = useState(false);

  async function handleGrade({ grade, feedback }) {
    // Evaluating a submission is its own route/controller on the real
    // backend (PATCH /submissions/:id/evaluate), separate from assignments.
    await submissionsApi.evaluateSubmission(assignment.submission.id, grade, feedback);
    showToast(t('supervisor.assignments.gradeSubmitted'));
    refetch();
  }

  async function handleEditSubmit(values) {
    await assignmentsApi.updateAssignment(assignment.id, values);
    showToast(t('supervisor.assignments.updated'));
    refetch();
  }

  if (!assignment) {
    return <SkeletonRows rows={5} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Link to="/supervisor/assignments" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <CaretLeft className="h-4 w-4" aria-hidden="true" />
        {t('supervisor.assignments.backToAssignments')}
      </Link>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{assignment.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{t('supervisor.assignments.due', { date: formatDate(assignment.deadline) })}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{t(`common.priority.${assignment.priority}`)}</Badge>
            <StatusBadge status={assignment.status} />
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <PencilSimple className="h-4 w-4" aria-hidden="true" />
              {t('supervisor.assignments.edit')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{assignment.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('supervisor.assignments.submission')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SubmissionViewer submission={assignment.submission} />
          {assignment.submission && <GradeForm submission={assignment.submission} onSubmit={handleGrade} />}
        </CardContent>
      </Card>

      <AssignmentFormDialog open={isEditing} onClose={() => setIsEditing(false)} onSubmit={handleEditSubmit} assignment={assignment} />
    </div>
  );
}
