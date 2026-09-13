import StatusBadge from '../../../components/shared/StatusBadge';
import DocumentLink from '../../../components/shared/DocumentLink';
import { formatDateTime } from '../../../lib/utils';

/**
 * Full upload history for a document request — every version the intern
 * has submitted, not just the latest one shown in the requests table.
 */
export default function DocumentVersionHistory({ documents }) {
  if (!documents || documents.length === 0) {
    return <p className="text-sm text-muted-foreground">No document submitted yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {documents.map((document) => (
        <div key={document.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
          <div>
            <DocumentLink fileName={document.fileName} url={document.fileUrl} />
            <p className="mt-0.5 text-xs text-muted-foreground">
              v{document.version} · Uploaded {formatDateTime(document.uploadDate)}
            </p>
            {document.status === 'Rejected' && document.rejectionReason && (
              <p className="mt-0.5 text-xs text-destructive">Rejected: {document.rejectionReason}</p>
            )}
          </div>
          <StatusBadge status={document.status} />
        </div>
      ))}
    </div>
  );
}
