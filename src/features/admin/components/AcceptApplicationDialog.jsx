import { useState } from 'react';
import { WarningCircle } from '@phosphor-icons/react';
import Dialog from '../../../components/ui/Dialog';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useTeams } from '../../../hooks/useTeams';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * Confirmation step before actually accepting an application — shows the
 * candidate's preferred team and lets the admin either go with it or pick
 * a different one, instead of the team being assigned silently. Picking a
 * different team is allowed (the candidate isn't entitled to their
 * preference), but it's called out so the admin knows the intern will be
 * notified they didn't get the team they asked for.
 */
export default function AcceptApplicationDialog({ open, onClose, application, onConfirm }) {
  const { t, tTeam } = useLanguage();
  const { teams } = useTeams();
  const [teamId, setTeamId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const hasPreference = application?.teamPreference && application.teamPreference !== 'No preference';
  const preferredTeam = hasPreference ? teams.find((t) => t.name === application.teamPreference) : null;

  // Pre-select the preferred team each time the dialog opens (and once the
  // teams list has loaded) — done during render, not in an effect.
  const resetKey = open ? `open:${preferredTeam?.id ?? ''}` : 'closed';
  const [lastResetKey, setLastResetKey] = useState(null);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    if (open) {
      setTeamId(preferredTeam ? String(preferredTeam.id) : '');
      setSubmitError('');
    }
  }

  if (!application) return null;

  const isOverriding = hasPreference && teamId !== String(preferredTeam?.id ?? '');

  async function confirm() {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await onConfirm(teamId || null);
      onClose();
    } catch (error) {
      setSubmitError(error.message || t('admin.review.acceptFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('admin.review.acceptDialogTitle')} description={t('admin.review.acceptDialogDescription')}>
      <div className="flex flex-col gap-4">
        {submitError && (
          <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            {submitError}
          </p>
        )}
        <p className="text-sm text-foreground">
          {t('admin.review.preferredTeam')} <span className="font-medium">{hasPreference ? tTeam(application.teamPreference) : t('admin.review.noPreference')}</span>
        </p>

        <Select id="accept-team" label={t('admin.review.assignToTeam')} value={teamId} onChange={(e) => setTeamId(e.target.value)} placeholder={t('admin.review.leaveUnassigned')}>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {tTeam(team)}
            </option>
          ))}
        </Select>

        {isOverriding && (
          <p className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 px-3 py-2.5 text-sm text-foreground">
            <WarningCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            {t('admin.review.overrideWarning', { team: tTeam(application.teamPreference) })}
          </p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button variant="accent" onClick={confirm} isLoading={isSubmitting}>
            {t('admin.review.confirmAndAccept')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
