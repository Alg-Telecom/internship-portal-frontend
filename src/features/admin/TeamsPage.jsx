import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useTeams, useCreateTeam, useUpdateTeam } from '../../hooks/useTeams';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import TeamsTable from './components/TeamsTable';
import TeamFormDialog from './components/TeamFormDialog';
import AssignMembersDialog from './components/AssignMembersDialog';
import { useLanguage } from '../../context/LanguageContext';

export default function TeamsPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.teams.title'));
  const { teams, isLoading } = useTeams();
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const { showToast } = useToast();
  const [editingTeam, setEditingTeam] = useState(undefined); // undefined = closed, null = create, object = edit
  const [assigningTeam, setAssigningTeam] = useState(null);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.teams.title')}</CardTitle>
        <Button size="sm" onClick={() => setEditingTeam(null)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('admin.teams.newTeam')}
        </Button>
      </CardHeader>
      <TeamsTable teams={teams} isLoading={isLoading} onEdit={setEditingTeam} onAssignMembers={setAssigningTeam} />

      <TeamFormDialog open={editingTeam !== undefined} onClose={() => setEditingTeam(undefined)} onSubmit={handleSubmit} team={editingTeam} />
      <AssignMembersDialog open={!!assigningTeam} onClose={() => setAssigningTeam(null)} team={assigningTeam} onChanged={() => {}} />
    </Card>
  );
}
