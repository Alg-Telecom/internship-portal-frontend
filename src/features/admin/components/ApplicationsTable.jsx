import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Avatar from '../../../components/ui/Avatar';
import { formatDate, fullName } from '../../../lib/utils';

export default function ApplicationsTable({ applications, isLoading, onReview }) {
  const columns = [
    {
      key: 'candidate',
      header: 'Candidate',
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
    { key: 'university', header: 'University', render: (row) => row.university },
    { key: 'teamPreference', header: 'Team preference', render: (row) => row.teamPreference },
    { key: 'submissionDate', header: 'Submitted', render: (row) => formatDate(row.submissionDate) },
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
            onReview(row);
          }}
          className="cursor-pointer text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={applications}
      isLoading={isLoading}
      emptyTitle="No applications found"
      emptyDescription="Try adjusting your search or status filter."
      onRowClick={onReview}
    />
  );
}
