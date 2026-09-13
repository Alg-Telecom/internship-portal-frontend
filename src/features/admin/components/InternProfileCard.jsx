import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import { fullName, formatDate } from '../../../lib/utils';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value || '—'}</p>
    </div>
  );
}

export default function InternProfileCard({ intern, team }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar firstName={intern.firstName} lastName={intern.lastName} size="lg" />
          <div>
            <CardTitle>{fullName(intern)}</CardTitle>
            <p className="text-sm text-muted-foreground">{intern.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field label="Student ID" value={intern.studentId} />
        <Field label="University" value={intern.university} />
        <Field label="Field of study" value={intern.fieldOfStudy} />
        <Field label="Academic level" value={intern.academicLevel} />
        <Field label="Team" value={team?.name} />
        <Field label="Supervisor" value={team?.supervisor ? `${team.supervisor.firstName} ${team.supervisor.lastName}` : '—'} />
        <Field label="Registered" value={formatDate(intern.registrationDate)} />
        <Field label="Phone" value={intern.phoneNumber} />
      </CardContent>
    </Card>
  );
}
