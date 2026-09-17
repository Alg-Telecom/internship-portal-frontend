import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import { formatDate, fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';
import { useTeams } from '../../../hooks/useTeams';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value || '—'}</p>
    </div>
  );
}

export default function CandidateProfileSummary({ application }) {
  const { t, tTeam } = useLanguage();
  const { teams } = useTeams();
  // Prefer the live team record (so a team's own French/Arabic name, set
  // after this application was submitted, still applies) — fall back to
  // the seeded-name lookup for a team that's since been deleted.
  const preferredTeam = teams.find((team) => team.name === application.teamPreference);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar firstName={application.firstName} lastName={application.lastName} size="lg" />
          <div>
            <CardTitle>{fullName(application)}</CardTitle>
            <p className="text-sm text-muted-foreground">{application.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Field label={t('admin.candidateProfile.personalId')} value={application.personalId} />
        <Field label={t('admin.candidateProfile.phone')} value={application.phone} />
        <Field label={t('admin.candidateProfile.birthday')} value={formatDate(application.birthday)} />
        <Field label={t('admin.candidateProfile.university')} value={application.university} />
        <Field label={t('admin.candidateProfile.major')} value={application.major} />
        <Field label={t('admin.candidateProfile.grade')} value={application.grade} />
        <Field label={t('admin.candidateProfile.teamPreference')} value={tTeam(preferredTeam || application.teamPreference)} />
        <Field label={t('admin.candidateProfile.internshipDates')} value={`${formatDate(application.startDate)} → ${formatDate(application.endDate)}`} />
        <Field label={t('admin.candidateProfile.submitted')} value={formatDate(application.submissionDate)} />
      </CardContent>
    </Card>
  );
}
