import DataTable from '../../../components/shared/DataTable';
import StatusBadge from '../../../components/shared/StatusBadge';
import SubmittedDocumentPreview from './SubmittedDocumentPreview';
import { fullName, formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function DocumentRequestsTable({ requests, isLoading, internsById, onApprove, onReject, onSelect }) {
  const { t } = useLanguage();
  const columns = [
    { key: 'intern', header: t('admin.documentRequests.intern'), render: (row) => (internsById[row.internId] ? fullName(internsById[row.internId]) : '—') },
    { key: 'title', header: t('admin.documentRequests.document'), render: (row) => row.title },
    { key: 'deadline', header: t('admin.documentRequests.deadline'), render: (row) => formatDate(row.deadline) },
    { key: 'status', header: t('common.status'), render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'document',
      header: t('admin.documentRequests.submission'),
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

  return <DataTable columns={columns} rows={requests} isLoading={isLoading} emptyTitle={t('admin.documentRequests.noneYet')} onRowClick={onSelect} />;
}
