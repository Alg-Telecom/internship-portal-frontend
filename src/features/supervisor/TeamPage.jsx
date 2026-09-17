import { useState, useMemo } from 'react';
import { UsersThree } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useInterns } from '../../hooks/useUsers';
import { useTeams } from '../../hooks/useTeams';
import { useAssignments } from '../../hooks/useAssignments';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import StatusBadge from '../../components/shared/StatusBadge';
import EmptyState from '../../components/shared/EmptyState';
import AssignedInternsTable from './components/AssignedInternsTable';
import InternProgressDrawer from './components/InternProgressDrawer';
import { useLanguage } from '../../context/LanguageContext';

export default function TeamPage() {
  const { t, tTeam } = useLanguage();
  usePageHeader(t('supervisor.team.title'));
  const { user } = useAuth();
  const { teams } = useTeams();
  const myTeams = teams.filter((t) => t.supervisorId === user.id);
  const { interns, isLoading } = useInterns();
  const { assignments } = useAssignments({ supervisorId: user.id });
  const [selectedIntern, setSelectedIntern] = useState(null);

  // A supervisor can manage several teams — one section per team, each
  // with its own intern table, instead of one flat list mixing everyone.
  const assignmentsByIntern = useMemo(
    () =>
      assignments.reduce((acc, a) => {
        (acc[a.internId] = acc[a.internId] || []).push(a);
        return acc;
      }, {}),
    [assignments]
  );

  if (myTeams.length === 0) {
    return (
      <Card>
        <EmptyState icon={UsersThree} title={t('supervisor.dashboard.noTeamYet')} description={t('supervisor.dashboard.noTeamDescription')} />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {myTeams.map((team) => {
        const teamInterns = interns.filter((i) => i.teamId === team.id);
        return (
          <Card key={team.id}>
            <CardHeader>
              <div>
                <CardTitle>{tTeam(team)}</CardTitle>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {t('supervisor.team.interns', { count: teamInterns.length, plural: teamInterns.length === 1 ? '' : 's' })}
                </p>
              </div>
              <StatusBadge status={team.status} />
            </CardHeader>
            <AssignedInternsTable
              interns={teamInterns}
              isLoading={isLoading}
              assignmentsByIntern={assignmentsByIntern}
              onSelect={setSelectedIntern}
            />
          </Card>
        );
      })}

      <InternProgressDrawer intern={selectedIntern} onClose={() => setSelectedIntern(null)} />
    </div>
  );
}
