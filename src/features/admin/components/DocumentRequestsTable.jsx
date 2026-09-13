import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import SubmittedDocumentPreview from './SubmittedDocumentPreview';
import { fullName, formatDate } from '../../../lib/utils';

export default function DocumentRequestsTable({ requests, isLoading, internsById, onApprove, onReject, onSelect }) {
  const columns = [
    { key: 'intern', header: 'Intern', render: (row) => (internsById[row.internId] ? fullName(internsById[row.internId]) : '—') },
    { key: 'title', header: 'Document', render: (row) => row.title },
    { key: 'deadline', header: 'Deadline', render: (row) => formatDate(row.deadline) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'document',
      header: 'Submission',
      className: 'min-w-[280px]',
      // Row click opens the full detail page; stop the click here so the
      // inline approve/reject controls don't also trigger navigation.
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <SubmittedDocumentPreview
            document={row.latestDocument}
            onApprove={() => onApprove(row.latestDocument.id)}
            onReject={(reason) => onReject(row.latestDocument.id, reason)}
          />
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={requests} isLoading={isLoading} emptyTitle="No document requests yet" onRowClick={onSelect} />;
}
