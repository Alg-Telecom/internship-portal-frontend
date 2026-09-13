import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import { formatDate, fullName } from '../../../lib/utils';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value || '—'}</p>
    </div>
  );
}

export default function CandidateProfileSummary({ application }) {
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
        <Field label="Personal ID" value={application.personalId} />
        <Field label="Phone" value={application.phone} />
        <Field label="Birthday" value={formatDate(application.birthday)} />
        <Field label="University" value={application.university} />
        <Field label="Major" value={application.major} />
        <Field label="Grade" value={application.grade} />
        <Field label="Team preference" value={application.teamPreference} />
        <Field label="Internship dates" value={`${formatDate(application.startDate)} → ${formatDate(application.endDate)}`} />
        <Field label="Submitted" value={formatDate(application.submissionDate)} />
      </CardContent>
    </Card>
  );
}
