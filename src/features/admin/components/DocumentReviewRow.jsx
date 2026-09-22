import { useState } from 'react';
import { X } from '@phosphor-icons/react';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/shared/StatusBadge';
import Dialog from '../../../components/ui/Dialog';
import Textarea from '../../../components/ui/Textarea';
import DocumentLink from '../../../components/shared/DocumentLink';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * One row in CandidateDocumentsList — Reject a single document (CV,
 * photo, ...), per the sequence diagram's document-validation ALT
 * fragment. Rejecting requires a reason. `onAccept` is optional: the real
 * backend has no per-document approve action (a document is only ever
 * approved automatically when the whole application is accepted), so the
 * Accept button only renders when a caller actually passes one.
 */
export default function DocumentReviewRow({ label, fileName, fileUrl, status, rejectionReason, actionable = true, onAccept, onReject }) {
  const { t } = useLanguage();
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
          {status === 'Rejected' && rejectionReason && <p className="mt-1 text-xs text-destructive">{t('admin.review.reason', { reason: rejectionReason })}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {status === 'Pending' && actionable && (
          <>
            <Button size="sm" variant="outline" onClick={() => setIsRejecting(true)}>
              <X className="h-4 w-4" aria-hidden="true" />
              {t('common.reject')}
            </Button>
            {onAccept && (
              <Button size="sm" variant="accent" onClick={onAccept}>
                {t('common.accept')}
              </Button>
            )}
          </>
        )}
      </div>

      <Dialog open={isRejecting} onClose={() => setIsRejecting(false)} title={t('admin.review.rejectTitle', { label })} description={t('admin.review.rejectDescription')}>
        <Textarea
          id={`reject-reason-${label}`}
          label={t('admin.review.rejectionReason')}
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t('admin.review.rejectionPlaceholder')}
        />
        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsRejecting(false)} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button variant="destructive" onClick={confirmReject} isLoading={isSubmitting} disabled={!reason.trim()}>
            {t('admin.review.confirmRejection')}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
