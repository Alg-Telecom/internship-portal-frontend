import { UsersThree } from "@phosphor-icons/react";
import Card, { CardContent } from "../../../components/ui/Card";
import StatusBadge from "../../../components/shared/StatusBadge";
import { useLanguage } from "../../../context/LanguageContext";

export default function TeamSnapshotCard({ team }) {
  const { t, tTeam } = useLanguage();
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{tTeam(team)}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <UsersThree className="h-4 w-4" aria-hidden="true" />
            {t("supervisor.team.interns", { count: team.internCount, plural: team.internCount === 1 ? "" : "s" })}
          </p>
        </div>
        <StatusBadge status={team.status} />
      </CardContent>
    </Card>
  );
}
