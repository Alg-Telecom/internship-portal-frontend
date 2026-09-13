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
import AssignmentsTable from './components/AssignmentsTable';
import AssignmentFormDialog from './components/AssignmentFormDialog';
import * as assignmentsApi from '../../services/mockApi/assignmentsApi';

export default function AssignmentsPage() {
  usePageHeader('Assignments');
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
      showToast('Assignment updated.');
    } else {
      await assignmentsApi.createAssignment(values);
      showToast('Assignment created and assigned to the intern.');
    }
    refetch();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignments</CardTitle>
        <Button size="sm" onClick={() => setEditingAssignment(null)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New assignment
        </Button>
      </CardHeader>
      <AssignmentsTable
        assignments={assignments}
        isLoading={isLoading}
        internsById={internsById}
        onSelect={(a) => navigate(`/supervisor/assignments/${a.id}`)}
        onEdit={setEditingAssignment}
      />
      <AssignmentFormDialog
        open={editingAssignment !== undefined}
        onClose={() => setEditingAssignment(undefined)}
        onSubmit={handleSubmit}
        assignment={editingAssignment}
      />
    </Card>
  );
}
