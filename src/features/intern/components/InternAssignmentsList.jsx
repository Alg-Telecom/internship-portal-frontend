import { useState } from 'react';
import Select from '../../../components/ui/Select';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Badge from '../../../components/ui/Badge';
import { AssignmentStatus } from '../../../domain/enums';
import { formatDate } from '../../../lib/utils';

const PRIORITY_TONE = { Low: 'muted', Medium: 'warning', High: 'destructive' };

export default function InternAssignmentsList({ assignments, isLoading, onSelect }) {
  const [status, setStatus] = useState('');
  const filtered = status ? assignments.filter((a) => a.status === status) : assignments;

  const columns = [
    { key: 'title', header: 'Assignment', render: (row) => <span className="font-medium text-foreground">{row.title}</span> },
    { key: 'deadline', header: 'Deadline', render: (row) => formatDate(row.deadline) },
    { key: 'priority', header: 'Priority', render: (row) => <Badge tone={PRIORITY_TONE[row.priority]}>{row.priority}</Badge> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Select id="assignment-status-filter" value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-56" aria-label="Filter by status">
        <option value="">All statuses</option>
        {Object.values(AssignmentStatus).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
      <DataTable columns={columns} rows={filtered} isLoading={isLoading} emptyTitle="No assignments" onRowClick={onSelect} />
    </div>
  );
}
