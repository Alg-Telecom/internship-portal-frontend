import { useState } from 'react';
import Dialog from '../../../components/ui/Dialog';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useInterns, useSupervisors, useUpdateUser } from '../../../hooks/useUsers';
import { useTeams, useUpdateTeam } from '../../../hooks/useTeams';
import { fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function AssignMembersDialog({ open, onClose, team, onChanged }) {
  const { t, tTeam } = useLanguage();
  const { interns } = useInterns();
  const { supervisors } = useSupervisors();
  // A supervisor can manage several teams at once — showing how many they
  // already have here makes that explicit instead of it being a silent,
  // easy-to-miss side effect of picking the same name on two teams.
  const { teams } = useTeams();
  const updateTeam = useUpdateTeam();
  const updateUser = useUpdateUser();
  const [supervisorId, setSupervisorId] = useState('');

  // Show the team's current supervisor each time the dialog opens.
  const resetKey = open ? `open:${team?.id}:${team?.supervisorId ?? ''}` : 'closed';
  const [lastResetKey, setLastResetKey] = useState(null);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    if (open) setSupervisorId(team?.supervisorId || '');
  }

  if (!team) return null;

  async function handleSupervisorChange(value) {
    setSupervisorId(value);
    // Real backend has no dedicated "assign supervisor" route — a team's
    // supervisor is just a field updated via PATCH /teams/:id.
    await updateTeam.mutateAsync({ id: team.id, patch: { supervisorId: value || null } });
    onChanged();
  }

  async function toggleIntern(intern, checked) {
    // Likewise, an intern's team is just their own `teamId` field
    // (see backend/prisma/schema.prisma: User.teamId), updated via
    // PATCH /users/:id — there's no separate "assign intern" endpoint.
    await updateUser.mutateAsync({ id: intern.id, patch: { teamId: checked ? team.id : null } });
    onChanged();
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('admin.assignMembers.title', { team: tTeam(team) })} description={t('admin.assignMembers.description')} className="max-w-lg">
      <div className="flex flex-col gap-5">
        <Select
          id="team-supervisor"
          label={t('admin.assignMembers.supervisor')}
          value={supervisorId}
          onChange={(e) => handleSupervisorChange(e.target.value)}
          placeholder={t('admin.assignMembers.selectSupervisor')}
          helperText={t('admin.assignMembers.supervisorHelper')}
        >
          {supervisors.map((s) => {
            const otherTeams = teams.filter((tm) => tm.supervisorId === s.id && tm.id !== team.id).length;
            return (
              <option key={s.id} value={s.id}>
                {fullName(s)}
                {otherTeams > 0 ? t('admin.assignMembers.alreadySupervises', { count: otherTeams, plural: otherTeams > 1 ? 's' : '' }) : ''}
              </option>
            );
          })}
        </Select>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">{t('admin.assignMembers.interns')}</p>
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border border-border p-2">
            {interns.map((intern) => (
              <label key={intern.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                <input
                  type="checkbox"
                  checked={intern.teamId === team.id}
                  disabled={updateUser.isPending}
                  onChange={(e) => toggleIntern(intern, e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="text-foreground">{fullName(intern)}</span>
                {intern.teamId && intern.teamId !== team.id && <span className="text-xs text-muted-foreground">{t('admin.assignMembers.inAnotherTeam')}</span>}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={onClose}>
            {t('admin.assignMembers.done')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
