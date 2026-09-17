import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Avatar from '../../../components/ui/Avatar';
import { formatDate, fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';
import { useTeams } from '../../../hooks/useTeams';

export default function ApplicationsTable({ applications, isLoading, onReview }) {
  const { t, tTeam } = useLanguage();
  const { teams } = useTeams();
  const teamsByName = Object.fromEntries(teams.map((team) => [team.name, team]));
  const columns = [
    {
      key: 'candidate',
      header: t('admin.applications.candidate'),
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar firstName={row.firstName} lastName={row.lastName} size="sm" />
          <div>
            <p className="font-medium text-foreground">{fullName(row)}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'university', header: t('admin.applications.university'), render: (row) => row.university },
    { key: 'teamPreference', header: t('admin.applications.teamPreference'), render: (row) => tTeam(teamsByName[row.teamPreference] || row.teamPreference) },
    { key: 'submissionDate', header: t('admin.applications.submitted'), render: (row) => formatDate(row.submissionDate) },
    { key: 'status', header: t('common.status'), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReview(row);
          }}
          className="cursor-pointer text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          {t('admin.applications.review')}
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={applications}
      isLoading={isLoading}
      emptyTitle={t('admin.applications.noneFound')}
      emptyDescription={t('admin.applications.adjustSearch')}
      onRowClick={onReview}
    />
  );
}
