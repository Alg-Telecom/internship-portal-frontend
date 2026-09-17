import { useAssignments } from '../../../hooks/useAssignments';
import DataTable from '../../../components/shared/DataTable';
import { formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function InternGradesTab({ internId }) {
  const { t } = useLanguage();
  const { assignments, isLoading } = useAssignments({ internId, status: 'Evaluated' });

  const columns = [
    { key: 'title', header: t('common.field.assignment'), render: (row) => row.title },
    { key: 'submissionDate', header: t('common.field.submitted'), render: (row) => formatDate(row.submission?.submissionDate) },
    { key: 'grade', header: t('common.field.grade'), render: (row) => (row.submission?.grade != null ? `${row.submission.grade}/20` : '—') },
    { key: 'feedback', header: t('common.field.feedback'), render: (row) => row.submission?.feedback || '—' },
  ];

  return <DataTable columns={columns} rows={assignments} isLoading={isLoading} emptyTitle={t('common.field.noGradedAssignmentsYet')} />;
}
