import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import { formatDate } from '../../lib/utils';

/** Shared by the Supervisor and Intern Attendance pages (and admin's intern detail tab). */
export default function AttendanceHistoryTable({ records, isLoading }) {
  const columns = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'arrivalTime', header: 'Arrival', render: (row) => row.arrivalTime || '—' },
    { key: 'departureTime', header: 'Departure', render: (row) => row.departureTime || '—' },
    { key: 'remarks', header: 'Remarks', render: (row) => row.remarks || '—' },
  ];

  return <DataTable columns={columns} rows={records} isLoading={isLoading} emptyTitle="No attendance records yet" />;
}
