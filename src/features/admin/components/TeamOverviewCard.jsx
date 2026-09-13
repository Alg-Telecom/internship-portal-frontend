import { UsersThree } from '@phosphor-icons/react';
import Card, { CardContent } from '../../../components/ui/Card';
import StatusBadge from '../../../components/shared/StatusBadge';
import { fullName } from '../../../lib/utils';

export default function TeamOverviewCard({ team }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground">{team.name}</h3>
          <StatusBadge status={team.status} />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <UsersThree className="h-4 w-4" aria-hidden="true" />
            {team.internCount} intern{team.internCount === 1 ? '' : 's'}
          </span>
          <span className="text-foreground">{team.supervisor ? fullName(team.supervisor) : 'No supervisor assigned'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
