import { UsersThree, PencilSimple } from '@phosphor-icons/react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import { fullName, formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function TeamsTable({ teams, isLoading, onEdit, onAssignMembers }) {
  const { t, tTeam } = useLanguage();
  const columns = [
    { key: 'name', header: t('admin.teams.team'), render: (row) => <span className="font-medium text-foreground">{tTeam(row)}</span> },
    { key: 'supervisor', header: t('admin.teams.supervisor'), render: (row) => (row.supervisor ? fullName(row.supervisor) : '—') },
    { key: 'internCount', header: t('admin.teams.interns'), render: (row) => row.internCount },
    { key: 'dates', header: t('admin.teams.dates'), render: (row) => `${formatDate(row.startDate)} → ${formatDate(row.endDate)}` },
    { key: 'status', header: t('common.status'), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onAssignMembers(row)}
            className="flex cursor-pointer items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <UsersThree className="h-4 w-4" aria-hidden="true" />
            {t('admin.teams.members')}
          </button>
          <button
            type="button"
            onClick={() => onEdit(row)}
            aria-label={t('admin.teams.editAria', { name: row.name })}
            className="cursor-pointer text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <PencilSimple className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={teams} isLoading={isLoading} emptyTitle={t('admin.teams.noneYet')} />;
}
