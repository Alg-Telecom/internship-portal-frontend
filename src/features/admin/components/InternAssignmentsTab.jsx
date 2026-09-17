import { useAssignments } from '../../../hooks/useAssignments';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function InternAssignmentsTab({ internId }) {
  const { t } = useLanguage();
  const { assignments, isLoading } = useAssignments({ internId });

  const columns = [
    { key: 'title', header: t('common.field.assignment'), render: (row) => row.title },
    { key: 'deadline', header: t('common.field.deadline'), render: (row) => formatDate(row.deadline) },
    { key: 'status', header: t('common.field.status'), render: (row) => <StatusBadge status={row.status} /> },
  ];

  return <DataTable columns={columns} rows={assignments} isLoading={isLoading} emptyTitle={t('common.field.noAssignmentsYet')} />;
}
