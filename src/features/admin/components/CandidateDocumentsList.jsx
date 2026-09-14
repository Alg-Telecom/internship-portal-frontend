import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import DocumentReviewRow from './DocumentReviewRow';
import * as applicationsApi from '../../../services/mockApi/applicationsApi';

export default function CandidateDocumentsList({ application, onChanged }) {
  async function review(field, status, rejectionReason = '') {
    await applicationsApi.reviewDocument(application.id, field, { status, rejectionReason });
    onChanged();
  }

  // Once the application itself has a decision (e.g. rejecting one document
  // just rejected the whole application), the other document has nothing
  // left to decide — stop offering Accept/Reject on it even if its own
  // status is still technically Pending.
  const isDecided = application.status !== 'Pending';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submitted Documents</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DocumentReviewRow
          label="Curriculum Vitae"
          fileName={application.cvFileName}
          fileUrl={application.cvFileUrl}
          status={application.cvStatus}
          rejectionReason={application.cvRejectionReason}
          actionable={!isDecided}
          onAccept={() => review('cv', 'Approved')}
          onReject={(reason) => review('cv', 'Rejected', reason)}
        />
        <DocumentReviewRow
          label="Personal Photograph"
          fileName={application.photoFileName}
          fileUrl={application.photoFileUrl}
          status={application.photoStatus}
          rejectionReason={application.photoRejectionReason}
          actionable={!isDecided}
          onAccept={() => review('photo', 'Approved')}
          onReject={(reason) => review('photo', 'Rejected', reason)}
        />
      </CardContent>
    </Card>
  );
}
