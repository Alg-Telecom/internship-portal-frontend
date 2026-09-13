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
import * as assignmentsApi from '../../services/mockApi/assignmentsApi';

export default function AssignmentDetailPage() {
  usePageHeader('Assignment Details');
  const { id } = useParams();
  const { showToast } = useToast();
  const { assignment, isLoading, refetch } = useAssignment(id);
  const [isEditing, setIsEditing] = useState(false);

  async function handleGrade({ grade, feedback }) {
    await assignmentsApi.evaluateSubmission(assignment.submission.id, { grade, feedback });
    showToast('Grade submitted to the intern.');
    refetch();
  }

  async function handleEditSubmit(values) {
    await assignmentsApi.updateAssignment(assignment.id, values);
    showToast('Assignment updated.');
    refetch();
  }

  if (isLoading || !assignment) {
    return <SkeletonRows rows={5} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Link to="/supervisor/assignments" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <CaretLeft className="h-4 w-4" aria-hidden="true" />
        Back to assignments
      </Link>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>{assignment.title}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Due {formatDate(assignment.deadline)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{assignment.priority}</Badge>
            <StatusBadge status={assignment.status} />
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <PencilSimple className="h-4 w-4" aria-hidden="true" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{assignment.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission</CardTitle>
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
