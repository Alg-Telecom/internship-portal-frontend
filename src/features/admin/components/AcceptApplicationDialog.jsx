import { useEffect, useState } from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import Dialog from '../../../components/ui/Dialog';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useTeams } from '../../../hooks/useTeams';

/**
 * Confirmation step before actually accepting an application — shows the
 * candidate's preferred team and lets the admin either go with it or pick
 * a different one, instead of the team being assigned silently. Picking a
 * different team is allowed (the candidate isn't entitled to their
 * preference), but it's called out so the admin knows the intern will be
 * notified they didn't get the team they asked for.
 */
export default function AcceptApplicationDialog({ open, onClose, application, onConfirm }) {
  const { teams } = useTeams();
  const [teamId, setTeamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPreference = application?.teamPreference && application.teamPreference !== 'No preference';
  const preferredTeam = hasPreference ? teams.find((t) => t.name === application.teamPreference) : null;

  useEffect(() => {
    if (open) setTeamId(preferredTeam ? String(preferredTeam.id) : '');
  }, [open, preferredTeam]);

  if (!application) return null;

  const isOverriding = hasPreference && teamId !== String(preferredTeam?.id ?? '');

  async function confirm() {
    setIsSubmitting(true);
    try {
      await onConfirm(teamId || null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Accept application" description="Confirm which team this intern will join.">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-foreground">
          Preferred team: <span className="font-medium">{hasPreference ? application.teamPreference : 'No preference'}</span>
        </p>

        <Select id="accept-team" label="Assign to team" value={teamId} onChange={(e) => setTeamId(e.target.value)} placeholder="Leave unassigned for now">
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </Select>

        {isOverriding && (
          <p className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 px-3 py-2.5 text-sm text-foreground">
            <WarningCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            This isn't their preferred team ("{application.teamPreference}") — they'll be notified they were assigned here instead.
          </p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="accent" onClick={confirm} isLoading={isSubmitting}>
            Confirm &amp; accept
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
