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
import { useLanguage } from '../../context/LanguageContext';

export default function TeamsPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.teams.title'));
  const { teams, isLoading, refetch } = useTeams();
  const { showToast } = useToast();
  const [editingTeam, setEditingTeam] = useState(undefined); // undefined = closed, null = create, object = edit
  const [assigningTeam, setAssigningTeam] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(values) {
    if (editingTeam) {
      await teamsApi.updateTeam(editingTeam.id, values);
      showToast(t('admin.teams.updated'));
    } else {
      await teamsApi.createTeam(values);
      showToast(t('admin.teams.created'));
    }
    refetch();
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await teamsApi.deleteTeam(deletingTeam.id);
      showToast(t('admin.teams.deleted', { name: deletingTeam.name }), { type: 'info' });
      setDeletingTeam(null);
      refetch();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.teams.title')}</CardTitle>
        <Button size="sm" onClick={() => setEditingTeam(null)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('admin.teams.newTeam')}
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
        title={t('admin.teams.deleteTitle')}
        description={
          deletingTeam
            ? t('admin.teams.deleteDescription', {
                name: deletingTeam.name,
                internNote: deletingTeam.internCount ? t('admin.teams.deleteInternNote', { count: deletingTeam.internCount }) : '',
              })
            : ''
        }
        confirmLabel={t('admin.teams.deleteConfirmLabel')}
      />
    </Card>
  );
}
