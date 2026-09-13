import { useAssignments } from '../../../hooks/useAssignments';
import DataTable from '../../../components/shared/DataTable';
import { formatDate } from '../../../lib/utils';

export default function InternGradesTab({ internId }) {
  const { assignments, isLoading } = useAssignments({ internId, status: 'Evaluated' });

  const columns = [
    { key: 'title', header: 'Assignment', render: (row) => row.title },
    { key: 'submissionDate', header: 'Submitted', render: (row) => formatDate(row.submission?.submissionDate) },
    { key: 'grade', header: 'Grade', render: (row) => (row.submission?.grade != null ? `${row.submission.grade}/20` : '—') },
    { key: 'feedback', header: 'Feedback', render: (row) => row.submission?.feedback || '—' },
  ];

  return <DataTable columns={columns} rows={assignments} isLoading={isLoading} emptyTitle="No graded assignments yet" />;
}
