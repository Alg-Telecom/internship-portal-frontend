import DocumentLink from '../../../components/shared/DocumentLink';
import { formatDateTime } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function SubmissionViewer({ submission }) {
  const { t } = useLanguage();
  if (!submission) {
    return <p className="text-sm text-muted-foreground">{t('supervisor.assignments.noSubmissionYet')}</p>;
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-medium text-muted-foreground">{t(`upload.types.${submission.submissionType || 'File'}`)}</p>
        <DocumentLink fileName={submission.fileName} url={submission.fileUrl} uploadType={submission.submissionType} />
        <p className="mt-1 text-xs text-muted-foreground">{t('supervisor.assignments.submitted', { date: formatDateTime(submission.submissionDate) })}</p>
        {submission.notes && <p className="mt-1 text-sm text-foreground">{submission.notes}</p>}
      </div>
    </div>
  );
}
