import { UsersThree, PencilSimple, TrashSimple } from '@phosphor-icons/react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import { fullName, formatDate } from '../../../lib/utils';

export default function TeamsTable({ teams, isLoading, onEdit, onAssignMembers, onDelete }) {
  const columns = [
    { key: 'name', header: 'Team', render: (row) => <span className="font-medium text-foreground">{row.name}</span> },
    { key: 'supervisor', header: 'Supervisor', render: (row) => (row.supervisor ? fullName(row.supervisor) : '—') },
    { key: 'internCount', header: 'Interns', render: (row) => row.internCount },
    { key: 'dates', header: 'Dates', render: (row) => `${formatDate(row.startDate)} → ${formatDate(row.endDate)}` },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
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
            Members
          </button>
          <button
            type="button"
            onClick={() => onEdit(row)}
            aria-label={`Edit ${row.name}`}
            className="cursor-pointer text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <PencilSimple className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            aria-label={`Delete ${row.name}`}
            className="cursor-pointer text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <TrashSimple className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={teams} isLoading={isLoading} emptyTitle="No teams yet" />;
}
