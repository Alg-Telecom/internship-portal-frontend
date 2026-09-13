import { useState } from 'react';
import { Check, X, WarningCircle } from '@phosphor-icons/react';
import Button from '../../../components/ui/Button';
import Dialog from '../../../components/ui/Dialog';
import Textarea from '../../../components/ui/Textarea';
import StatusBadge from '../../../components/shared/StatusBadge';

export default function ApplicationDecisionBar({ application, onAccept, onReject }) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentsReady = application.cvStatus === 'Approved' && application.photoStatus === 'Approved';
  const isDecided = application.status !== 'Pending';

  async function handleAccept() {
    setIsSubmitting(true);
    try {
      await onAccept();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function confirmReject() {
    setIsSubmitting(true);
    try {
      await onReject(reason);
      setIsRejecting(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isDecided) {
    return (
      <div className="sticky bottom-4 flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 shadow-popover">
        <p className="text-sm text-muted-foreground">This application has already been reviewed.</p>
        <StatusBadge status={application.status} />
      </div>
    );
  }

  return (
    <div className="sticky bottom-4 flex flex-col gap-3 rounded-lg border border-border bg-card px-5 py-4 shadow-popover sm:flex-row sm:items-center sm:justify-between">
      {!documentsReady && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <WarningCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Accept both submitted documents before deciding on this application.
        </p>
      )}
      <div className="flex justify-end gap-3 sm:ml-auto">
        <Button variant="outline" onClick={() => setIsRejecting(true)}>
          <X className="h-4 w-4" aria-hidden="true" />
          Reject Application
        </Button>
        <Button variant="accent" onClick={handleAccept} isLoading={isSubmitting} disabled={!documentsReady}>
          <Check className="h-4 w-4" aria-hidden="true" />
          Accept Application
        </Button>
      </div>

      <Dialog open={isRejecting} onClose={() => setIsRejecting(false)} title="Reject application" description="This will be recorded as the reason for rejection.">
        <Textarea id="application-reject-reason" label="Rejection reason" required value={reason} onChange={(e) => setReason(e.target.value)} />
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
