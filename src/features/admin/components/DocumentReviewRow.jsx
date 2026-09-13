import { useState } from 'react';
import { Check, X } from '@phosphor-icons/react';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/shared/StatusBadge';
import Dialog from '../../../components/ui/Dialog';
import Textarea from '../../../components/ui/Textarea';
import DocumentLink from '../../../components/shared/DocumentLink';

/**
 * One row in CandidateDocumentsList — Accept/Reject a single document
 * (CV or photo), per the sequence diagram's document-validation ALT
 * fragment. Rejecting requires a reason.
 */
export default function DocumentReviewRow({ label, fileName, fileUrl, status, rejectionReason, onAccept, onReject }) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="flex flex-col gap-3 rounded-md border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <DocumentLink fileName={fileName} url={fileUrl} className="mt-0.5" />
          {status === 'Rejected' && rejectionReason && <p className="mt-1 text-xs text-destructive">Reason: {rejectionReason}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {status === 'Pending' && (
          <>
            <Button size="sm" variant="outline" onClick={() => setIsRejecting(true)}>
              <X className="h-4 w-4" aria-hidden="true" />
              Reject
            </Button>
            <Button size="sm" variant="accent" onClick={onAccept}>
              <Check className="h-4 w-4" aria-hidden="true" />
              Accept
            </Button>
          </>
        )}
      </div>

      <Dialog open={isRejecting} onClose={() => setIsRejecting(false)} title={`Reject ${label}`} description="Explain what the candidate needs to correct.">
        <Textarea
          id={`reject-reason-${label}`}
          label="Rejection reason"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. The photo is not a recent passport-style photo."
        />
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
