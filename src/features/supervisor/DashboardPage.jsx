import { UsersThree, ClipboardText, CalendarCheck } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useTeams } from '../../hooks/useTeams';
import { useAssignments } from '../../hooks/useAssignments';
import StatCard from '../../components/shared/StatCard';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import EmptyState from '../../components/shared/EmptyState';
import TeamSnapshotCard from './components/TeamSnapshotCard';
import InternshipCalendar from '../../components/shared/InternshipCalendar';
import { useLanguage } from '../../context/LanguageContext';

export default function DashboardPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.dashboard.title'));
  const { user } = useAuth();
  const { teams } = useTeams();
  const { assignments } = useAssignments({ supervisorId: user.id });

  const myTeams = teams.filter((t) => t.supervisorId === user.id);
  const internCount = myTeams.reduce((sum, t) => sum + t.internCount, 0);
  const pendingReviews = assignments.filter((a) => a.status === 'Submitted').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={UsersThree} label={t('supervisor.dashboard.internsSupervised')} value={internCount} />
        <StatCard icon={ClipboardText} label={t('supervisor.dashboard.submissionsToReview')} value={pendingReviews} tone="accent" />
        <StatCard icon={CalendarCheck} label={t('supervisor.dashboard.teams')} value={myTeams.length} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('supervisor.dashboard.myTeams')}</CardTitle>
        </CardHeader>
        <CardContent>
          {myTeams.length === 0 ? (
            <EmptyState icon={UsersThree} title={t('supervisor.dashboard.noTeamYet')} description={t('supervisor.dashboard.noTeamDescription')} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {myTeams.map((team) => (
                <TeamSnapshotCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('supervisor.dashboard.calendar')}</CardTitle>
        </CardHeader>
        <CardContent>
          <InternshipCalendar />
        </CardContent>
      </Card>
    </div>
  );
}
