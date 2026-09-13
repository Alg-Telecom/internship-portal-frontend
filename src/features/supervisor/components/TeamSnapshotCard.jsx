import { UsersThree } from "@phosphor-icons/react";
import Card, { CardContent } from "../../../components/ui/Card";
import StatusBadge from "../../../components/shared/StatusBadge";

export default function TeamSnapshotCard({ team }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{team.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <UsersThree className="h-4 w-4" aria-hidden="true" />
            {team.internCount} intern{team.internCount === 1 ? "" : "s"}
          </p>
        </div>
        <StatusBadge status={team.status} />
      </CardContent>
    </Card>
  );
}
