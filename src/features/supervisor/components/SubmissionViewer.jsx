import DocumentLink from '../../../components/shared/DocumentLink';
import { formatDateTime } from '../../../lib/utils';

export default function SubmissionViewer({ submission }) {
  if (!submission) {
    return <p className="text-sm text-muted-foreground">No submission yet.</p>;
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-border px-4 py-3">
      <div>
        <DocumentLink fileName={submission.fileName} url={submission.fileUrl} />
        <p className="mt-1 text-xs text-muted-foreground">Submitted {formatDateTime(submission.submissionDate)}</p>
        {submission.notes && <p className="mt-1 text-sm text-foreground">{submission.notes}</p>}
      </div>
    </div>
  );
}
