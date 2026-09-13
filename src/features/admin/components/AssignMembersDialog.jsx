import { useState, useEffect } from 'react';
import Dialog from '../../../components/ui/Dialog';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useInterns, useSupervisors } from '../../../hooks/useUsers';
import { useTeams } from '../../../hooks/useTeams';
import { fullName } from '../../../lib/utils';
import * as teamsApi from '../../../services/mockApi/teamsApi';

export default function AssignMembersDialog({ open, onClose, team, onChanged }) {
  const { interns, refetch: refetchInterns } = useInterns();
  const { supervisors } = useSupervisors();
  // A supervisor can manage several teams at once — showing how many they
  // already have here makes that explicit instead of it being a silent,
  // easy-to-miss side effect of picking the same name on two teams.
  const { teams, refetch: refetchTeams } = useTeams();
  const [supervisorId, setSupervisorId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) setSupervisorId(team?.supervisorId || '');
  }, [open, team]);

  if (!team) return null;

  async function handleSupervisorChange(value) {
    setSupervisorId(value);
    await teamsApi.assignSupervisorToTeam(team.id, value);
    await refetchTeams();
    onChanged();
  }

  async function toggleIntern(intern, checked) {
    setIsSaving(true);
    try {
      await teamsApi.assignInternToTeam(intern.id, checked ? team.id : null);
      await refetchInterns();
      onChanged();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Members — ${team.name}`} description="Assign a supervisor and choose which interns belong to this team." className="max-w-lg">
      <div className="flex flex-col gap-5">
        <Select
          id="team-supervisor"
          label="Supervisor"
          value={supervisorId}
          onChange={(e) => handleSupervisorChange(e.target.value)}
          placeholder="Select a supervisor"
          helperText="A supervisor can manage more than one team — the count below shows their other assignments."
        >
          {supervisors.map((s) => {
            const otherTeams = teams.filter((t) => t.supervisorId === s.id && t.id !== team.id).length;
            return (
              <option key={s.id} value={s.id}>
                {fullName(s)}
                {otherTeams > 0 ? ` — already supervises ${otherTeams} other team${otherTeams > 1 ? 's' : ''}` : ''}
              </option>
            );
          })}
        </Select>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Interns</p>
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto rounded-md border border-border p-2">
            {interns.map((intern) => (
              <label key={intern.id} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted">
                <input
                  type="checkbox"
                  checked={intern.teamId === team.id}
                  disabled={isSaving}
                  onChange={(e) => toggleIntern(intern, e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="text-foreground">{fullName(intern)}</span>
                {intern.teamId && intern.teamId !== team.id && <span className="text-xs text-muted-foreground">(in another team)</span>}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
