import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useTeams, useCreateTeam, useUpdateTeam, useCompleteTeam } from '../../hooks/useTeams';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TeamsTable from './components/TeamsTable';
import TeamFormDialog from './components/TeamFormDialog';
import AssignMembersDialog from './components/AssignMembersDialog';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useLanguage } from '../../context/LanguageContext';

export default function TeamsPage() {
  const { t, tTeam } = useLanguage();
  usePageHeader(t('admin.teams.title'));
  const { teams, isLoading } = useTeams();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const { showToast } = useToast();
  const [editingTeam, setEditingTeam] = useState(undefined); // undefined = closed, null = create, object = edit
  const [assigningTeam, setAssigningTeam] = useState(null);
  const [completingTeam, setCompletingTeam] = useState(null);
  const completeTeam = useCompleteTeam();

  // NOTE: the real backend has no "delete team" endpoint (only
  // GET/GET/POST/PATCH on /teams — see backend/src/routes/teamsRoutes.js),
  // so the delete button/confirm dialog that the mock version had is
  // removed here rather than left pointing at an API call that doesn't
  // exist. Teams can still be edited (e.g. marked inactive via status).

  async function handleSubmit(values) {
    if (editingTeam) {
      await updateTeam.mutateAsync({ id: editingTeam.id, patch: values });
      showToast(t('admin.teams.updated'));
    } else {
      await createTeam.mutateAsync(values);
      showToast(t('admin.teams.created'));
    }
  }

  async function confirmComplete() {
    try {
      await completeTeam.mutateAsync(completingTeam.id);
      showToast(t('admin.teams.completed', { name: tTeam(completingTeam) }));
    } catch (err) {
      showToast(err.message, { type: 'error' });
    } finally {
      setCompletingTeam(null);
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
      <TeamsTable teams={teams} isLoading={isLoading} onEdit={setEditingTeam} onAssignMembers={setAssigningTeam} onComplete={setCompletingTeam} />

      <TeamFormDialog open={editingTeam !== undefined} onClose={() => setEditingTeam(undefined)} onSubmit={handleSubmit} team={editingTeam} />
      <ConfirmDialog
        open={!!completingTeam}
        onClose={() => setCompletingTeam(null)}
        onConfirm={confirmComplete}
        isLoading={completeTeam.isPending}
        isDestructive={false}
        title={t('admin.teams.completeTitle')}
        description={completingTeam ? t('admin.teams.completeDescription', { name: tTeam(completingTeam) }) : ''}
        confirmLabel={t('admin.teams.complete')}
      />
      <AssignMembersDialog open={!!assigningTeam} onClose={() => setAssigningTeam(null)} team={assigningTeam} onChanged={() => {}} />
    </Card>
  );
}
