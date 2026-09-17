import { UsersThree } from '@phosphor-icons/react';
import Card, { CardContent } from '../../../components/ui/Card';
import StatusBadge from '../../../components/shared/StatusBadge';
import { fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function TeamOverviewCard({ team }) {
  const { t, tTeam } = useLanguage();
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground">{tTeam(team)}</h3>
          <StatusBadge status={team.status} />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <UsersThree className="h-4 w-4" aria-hidden="true" />
            {t('admin.teamOverview.interns', { count: team.internCount, plural: team.internCount === 1 ? '' : 's' })}
          </span>
          <span className="text-foreground">{team.supervisor ? fullName(team.supervisor) : t('admin.teamOverview.noSupervisor')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
