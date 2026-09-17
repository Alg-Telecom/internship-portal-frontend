import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import { fullName, formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value || '—'}</p>
    </div>
  );
}

export default function InternProfileCard({ intern, team }) {
  const { t, tTeam } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar firstName={intern.firstName} lastName={intern.lastName} photoUrl={intern.profilePhotoUrl} size="lg" />
          <div>
            <CardTitle>{fullName(intern)}</CardTitle>
            <p className="text-sm text-muted-foreground">{intern.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label={t('common.field.studentId')} value={intern.studentId} />
        <Field label={t('common.field.university')} value={intern.university} />
        <Field label={t('common.field.fieldOfStudy')} value={intern.fieldOfStudy} />
        <Field label={t('common.field.academicLevel')} value={intern.academicLevel} />
        <Field label={t('common.field.team')} value={tTeam(team)} />
        <Field label={t('common.field.supervisor')} value={team?.supervisor ? `${team.supervisor.firstName} ${team.supervisor.lastName}` : '—'} />
        <Field label={t('common.field.registered')} value={formatDate(intern.registrationDate)} />
        <Field label={t('common.field.phone')} value={intern.phoneNumber} />
      </CardContent>
    </Card>
  );
}
