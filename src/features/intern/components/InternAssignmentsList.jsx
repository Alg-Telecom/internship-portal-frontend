import { useState } from 'react';
import Select from '../../../components/ui/Select';
import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import Badge from '../../../components/ui/Badge';
import { AssignmentStatus } from '../../../domain/enums';
import { formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

const PRIORITY_TONE = { Low: 'muted', Medium: 'warning', High: 'destructive' };

export default function InternAssignmentsList({ assignments, isLoading, onSelect }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('');
  const filtered = status ? assignments.filter((a) => a.status === status) : assignments;

  const columns = [
    { key: 'title', header: t('common.field.assignment'), render: (row) => <span className="font-medium text-foreground">{row.title}</span> },
    { key: 'deadline', header: t('common.field.deadline'), render: (row) => formatDate(row.deadline) },
    { key: 'priority', header: t('common.field.priority'), render: (row) => <Badge tone={PRIORITY_TONE[row.priority]}>{t(`common.priority.${row.priority}`)}</Badge> },
    { key: 'status', header: t('common.field.status'), render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Select id="assignment-status-filter" value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-56" aria-label={t('admin.applications.filterAriaLabel')}>
        <option value="">{t('common.allStatuses')}</option>
        {Object.values(AssignmentStatus).map((value) => (
          <option key={value} value={value}>
            {t(`status.${value}`)}
          </option>
        ))}
      </Select>
      <DataTable columns={columns} rows={filtered} isLoading={isLoading} emptyTitle={t('intern.assignments.noAssignments')} onRowClick={onSelect} />
    </div>
  );
}
