import DataTable from './DataTable';
import StatusBadge from './StatusBadge';
import { formatDate } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

/** Shared by the Supervisor and Intern Attendance pages (and admin's intern detail tab). */
export default function AttendanceHistoryTable({ records, isLoading }) {
  const { t } = useLanguage();
  const columns = [
    { key: 'date', header: t('common.field.date'), render: (row) => formatDate(row.date) },
    { key: 'status', header: t('common.field.status'), render: (row) => <StatusBadge status={row.status} /> },
    { key: 'arrivalTime', header: t('common.field.arrival'), render: (row) => row.arrivalTime || '—' },
    { key: 'departureTime', header: t('common.field.departure'), render: (row) => row.departureTime || '—' },
    { key: 'remarks', header: t('common.field.remarks'), render: (row) => row.remarks || '—' },
  ];

  return <DataTable columns={columns} rows={records} isLoading={isLoading} emptyTitle={t('common.field.noAttendanceYet')} />;
}
