import { useAssignments } from '../../../hooks/useAssignments';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatDate } from '../../../lib/utils';

export default function InternAssignmentsTab({ internId }) {
  const { assignments, isLoading } = useAssignments({ internId });

  const columns = [
    { key: 'title', header: 'Assignment', render: (row) => row.title },
    { key: 'deadline', header: 'Deadline', render: (row) => formatDate(row.deadline) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  return <DataTable columns={columns} rows={assignments} isLoading={isLoading} emptyTitle="No assignments yet" />;
}
