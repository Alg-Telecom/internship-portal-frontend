import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useTeams } from '../../hooks/useTeams';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import TeamsTable from './components/TeamsTable';
import TeamFormDialog from './components/TeamFormDialog';
import AssignMembersDialog from './components/AssignMembersDialog';
import * as teamsApi from '../../services/mockApi/teamsApi';

export default function TeamsPage() {
  usePageHeader('Teams');
  const { teams, isLoading, refetch } = useTeams();
  const { showToast } = useToast();
  const [editingTeam, setEditingTeam] = useState(undefined); // undefined = closed, null = create, object = edit
  const [assigningTeam, setAssigningTeam] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(values) {
    if (editingTeam) {
      await teamsApi.updateTeam(editingTeam.id, values);
      showToast('Team updated.');
    } else {
      await teamsApi.createTeam(values);
      showToast('Team created.');
    }
    refetch();
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await teamsApi.deleteTeam(deletingTeam.id);
      showToast(`"${deletingTeam.name}" has been deleted.`, { type: 'info' });
      setDeletingTeam(null);
      refetch();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teams</CardTitle>
        <Button size="sm" onClick={() => setEditingTeam(null)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New team
        </Button>
      </CardHeader>
      <TeamsTable teams={teams} isLoading={isLoading} onEdit={setEditingTeam} onAssignMembers={setAssigningTeam} onDelete={setDeletingTeam} />

      <TeamFormDialog open={editingTeam !== undefined} onClose={() => setEditingTeam(undefined)} onSubmit={handleSubmit} team={editingTeam} />
      <AssignMembersDialog open={!!assigningTeam} onClose={() => setAssigningTeam(null)} team={assigningTeam} onChanged={refetch} />

      <ConfirmDialog
        open={!!deletingTeam}
        onClose={() => setDeletingTeam(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete team"
        description={
          deletingTeam
            ? `This permanently deletes "${deletingTeam.name}"${deletingTeam.internCount ? ` — ${deletingTeam.internCount} intern(s) currently assigned to it will need to be reassigned` : ''}. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete team"
      />
    </Card>
  );
}
