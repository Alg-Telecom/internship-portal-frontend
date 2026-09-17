import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../hooks/useAssignments';
import { useInterns } from '../../hooks/useUsers';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AssignmentCalendar from '../../components/shared/AssignmentCalendar';
import AssignmentsTable from './components/AssignmentsTable';
import AssignmentFormDialog from './components/AssignmentFormDialog';
import * as assignmentsApi from '../../services/mockApi/assignmentsApi';
import { useLanguage } from '../../context/LanguageContext';

export default function AssignmentsPage() {
  const { t } = useLanguage();
  usePageHeader(t('supervisor.assignments.title'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignments, isLoading, refetch } = useAssignments({ supervisorId: user.id });
  const { interns } = useInterns();
  const { showToast } = useToast();
  const [editingAssignment, setEditingAssignment] = useState(undefined); // undefined = closed, null = create, object = edit

  const internsById = Object.fromEntries(interns.map((i) => [i.id, i]));

  async function handleSubmit(values) {
    if (editingAssignment) {
      await assignmentsApi.updateAssignment(editingAssignment.id, values);
      showToast(t('supervisor.assignments.updated'));
    } else {
      await assignmentsApi.createAssignment(values);
      showToast(t('supervisor.assignments.created'));
    }
    refetch();
  }

  function goToAssignment(a) {
    navigate(`/supervisor/assignments/${a.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('supervisor.assignments.deadlines')}</CardTitle>
        </CardHeader>
        <div className="px-5 py-4">
          <AssignmentCalendar assignments={assignments} internsById={internsById} onSelectAssignment={goToAssignment} />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('supervisor.assignments.title')}</CardTitle>
          <Button size="sm" onClick={() => setEditingAssignment(null)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('supervisor.assignments.newAssignment')}
          </Button>
        </CardHeader>
        <AssignmentsTable
          assignments={assignments}
          isLoading={isLoading}
          internsById={internsById}
          onSelect={goToAssignment}
          onEdit={setEditingAssignment}
        />
        <AssignmentFormDialog
          open={editingAssignment !== undefined}
          onClose={() => setEditingAssignment(undefined)}
          onSubmit={handleSubmit}
          assignment={editingAssignment}
        />
      </Card>
    </div>
  );
}
