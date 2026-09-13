import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import DocumentReviewRow from './DocumentReviewRow';
import * as applicationsApi from '../../../services/mockApi/applicationsApi';

export default function CandidateDocumentsList({ application, onChanged }) {
  async function review(field, status, rejectionReason = '') {
    await applicationsApi.reviewDocument(application.id, field, { status, rejectionReason });
    onChanged();
  }

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
          onAccept={() => review('cv', 'Approved')}
          onReject={(reason) => review('cv', 'Rejected', reason)}
        />
        <DocumentReviewRow
          label="Personal Photograph"
          fileName={application.photoFileName}
          fileUrl={application.photoFileUrl}
          status={application.photoStatus}
          rejectionReason={application.photoRejectionReason}
          onAccept={() => review('photo', 'Approved')}
          onReject={(reason) => review('photo', 'Rejected', reason)}
        />
      </CardContent>
    </Card>
  );
}
