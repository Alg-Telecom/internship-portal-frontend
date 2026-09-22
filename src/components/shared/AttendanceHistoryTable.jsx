import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import { formatDate, fullName } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Shared by the Supervisor and Intern Attendance pages (and admin's intern
 * detail tab). `internsById` is only needed where one table can list
 * several different interns' records at once (the supervisor's history,
 * which is the only one of the three) — pass it and an Intern column
 * appears; leave it out (intern's own history, admin's per-intern tab —
 * every row is already known to be the same person) and the table looks
 * exactly as before.
 */
export default function AttendanceHistoryTable({ records, isLoading, internsById }) {
  const { t } = useLanguage();
  const columns = [
    { key: 'date', header: t('common.field.date'), render: (row) => formatDate(row.date) },
    ...(internsById
      ? [{ key: 'intern', header: t('supervisor.team.intern'), render: (row) => fullName(internsById[row.internId]) || '—' }]
      : []),
    { key: 'status', header: t('common.field.status'), render: (row) => <StatusBadge status={row.status} /> },
    { key: 'arrivalTime', header: t('common.field.arrival'), render: (row) => row.arrivalTime || '—' },
    { key: 'departureTime', header: t('common.field.departure'), render: (row) => row.departureTime || '—' },
    { key: 'remarks', header: t('common.field.remarks'), render: (row) => row.remarks || '—' },
  ];

  return <DataTable columns={columns} rows={records} isLoading={isLoading} emptyTitle={t('common.field.noAttendanceYet')} />;
}
