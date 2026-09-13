import { useState } from 'react';
import { Check, X } from '@phosphor-icons/react';
import Button from '../../../components/ui/Button';
import Dialog from '../../../components/ui/Dialog';
import Textarea from '../../../components/ui/Textarea';
import DocumentLink from '../../../components/shared/DocumentLink';
import { formatDateTime } from '../../../lib/utils';

/**
 * Shows the latest uploaded document for a request, with Approve/Reject
 * actions. No status badge here on purpose — the request's own Status
 * (Pending/Submitted/Approved/Rejected) already reflects this document's
 * outcome, so a second badge next to it would just repeat the same info.
 */
export default function SubmittedDocumentPreview({ document, onApprove, onReject }) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!document) {
    return <p className="text-sm text-muted-foreground">No document submitted yet.</p>;
  }

  async function confirmReject() {
    setIsSubmitting(true);
    try {
      await onReject(reason);
      setIsRejecting(false);
      setReason('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <div>
          <DocumentLink fileName={document.fileName} url={document.fileUrl} />
          <p className="mt-0.5 text-xs text-muted-foreground">
            v{document.version} · Uploaded {formatDateTime(document.uploadDate)}
          </p>
        </div>
      </div>
      {document.status === 'Pending' && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsRejecting(true)}>
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button size="sm" variant="accent" onClick={onApprove}>
            <Check className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}

      <Dialog open={isRejecting} onClose={() => setIsRejecting(false)} title="Reject document">
        <Textarea id="doc-reject-reason" label="Rejection reason" required value={reason} onChange={(e) => setReason(e.target.value)} />
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsRejecting(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmReject} isLoading={isSubmitting} disabled={!reason.trim()}>
            Confirm rejection
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
