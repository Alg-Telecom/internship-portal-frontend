import { PencilSimple } from '@phosphor-icons/react';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Badge from '../../../components/ui/Badge';
import { formatDate, fullName } from '../../../lib/utils';

const PRIORITY_TONE = { Low: 'muted', Medium: 'warning', High: 'destructive' };

export default function AssignmentsTable({ assignments, isLoading, internsById, onSelect, onEdit }) {
  const columns = [
    { key: 'title', header: 'Assignment', render: (row) => <span className="font-medium text-foreground">{row.title}</span> },
    { key: 'intern', header: 'Intern', render: (row) => (internsById[row.internId] ? fullName(internsById[row.internId]) : '—') },
    { key: 'deadline', header: 'Deadline', render: (row) => formatDate(row.deadline) },
    { key: 'priority', header: 'Priority', render: (row) => <Badge tone={PRIORITY_TONE[row.priority]}>{row.priority}</Badge> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
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
            onEdit(row);
          }}
          aria-label={`Edit ${row.title}`}
          className="cursor-pointer text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <PencilSimple className="h-4 w-4" aria-hidden="true" />
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} rows={assignments} isLoading={isLoading} emptyTitle="No assignments yet" onRowClick={onSelect} />;
}
