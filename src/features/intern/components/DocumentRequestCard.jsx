import { FileText, UploadSimple } from '@phosphor-icons/react';
import Card, { CardContent } from '../../../components/ui/Card';
import StatusBadge from '../../../components/shared/StatusBadge';
import Button from '../../../components/ui/Button';
import { formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function DocumentRequestCard({ request, onUpload }) {
  const { t } = useLanguage();
  const needsAction = request.status === 'Pending' || request.status === 'Rejected';

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-foreground">{request.title}</p>
            {request.description && <p className="mt-0.5 text-sm text-muted-foreground">{request.description}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{t('intern.documents.deadline', { date: formatDate(request.deadline) })}</p>
            {request.status === 'Rejected' && request.rejectionReason && (
              <p className="mt-1 text-xs text-destructive">{t('intern.documents.reason', { reason: request.rejectionReason })}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          {needsAction && (
            <Button size="sm" onClick={onUpload}>
              <UploadSimple className="h-4 w-4" aria-hidden="true" />
              {request.status === 'Rejected' ? t('intern.documents.resubmit') : t('intern.documents.upload')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
