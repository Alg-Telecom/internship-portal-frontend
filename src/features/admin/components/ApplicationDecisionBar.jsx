import { useState } from 'react';
import { Check, X, WarningCircle } from '@phosphor-icons/react';
import Button from '../../../components/ui/Button';
import Dialog from '../../../components/ui/Dialog';
import Textarea from '../../../components/ui/Textarea';
import StatusBadge from '../../../components/shared/StatusBadge';
import AcceptApplicationDialog from './AcceptApplicationDialog';
import { useLanguage } from '../../../context/LanguageContext';

export default function ApplicationDecisionBar({ application, onAccept, onReject }) {
  const { t } = useLanguage();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentsReady =
    application.cvStatus === 'Approved' &&
    application.photoStatus === 'Approved' &&
    application.agreementStatus === 'Approved' &&
    application.internshipRequestStatus === 'Approved';
  const isDecided = application.status !== 'Pending';

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
        <p className="text-sm text-muted-foreground">{t('admin.review.alreadyReviewed')}</p>
        <StatusBadge status={application.status} />
      </div>
    );
  }

  return (
    <div className="sticky bottom-4 flex flex-col gap-3 rounded-lg border border-border bg-card px-5 py-4 shadow-popover sm:flex-row sm:items-center sm:justify-between">
      {!documentsReady && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <WarningCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t('admin.review.requiredDocsWarning')}
        </p>
      )}
      <div className="flex justify-end gap-3 sm:ml-auto">
        <Button variant="outline" onClick={() => setIsRejecting(true)}>
          <X className="h-4 w-4" aria-hidden="true" />
          {t('admin.review.rejectApplication')}
        </Button>
        <Button variant="accent" onClick={() => setIsAccepting(true)} disabled={!documentsReady}>
          <Check className="h-4 w-4" aria-hidden="true" />
          {t('admin.review.acceptApplication')}
        </Button>
      </div>

      <AcceptApplicationDialog open={isAccepting} onClose={() => setIsAccepting(false)} application={application} onConfirm={onAccept} />

      <Dialog open={isRejecting} onClose={() => setIsRejecting(false)} title={t('admin.review.rejectApplicationTitle')} description={t('admin.review.rejectApplicationDescription')}>
        <Textarea id="application-reject-reason" label={t('admin.review.rejectionReason')} required value={reason} onChange={(e) => setReason(e.target.value)} />
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
