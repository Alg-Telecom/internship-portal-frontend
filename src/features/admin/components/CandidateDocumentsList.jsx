import Card, { CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import DocumentReviewRow from './DocumentReviewRow';
import DocumentLink from '../../../components/shared/DocumentLink';
import * as applicationsApi from '../../../services/mockApi/applicationsApi';
import { useLanguage } from '../../../context/LanguageContext';

export default function CandidateDocumentsList({ application, onChanged }) {
  const { t } = useLanguage();
  async function review(field, status, rejectionReason = '') {
    await applicationsApi.reviewDocument(application.id, field, { status, rejectionReason });
    onChanged();
  }

  // Once the application itself has a decision (e.g. rejecting one document
  // just rejected the whole application), the other documents have nothing
  // left to decide — stop offering Accept/Reject on them even if their own
  // status is still technically Pending.
  const isDecided = application.status !== 'Pending';
  const otherDocuments = application.otherDocuments || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.review.submittedDocuments')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <DocumentReviewRow
          label={t('admin.review.cv')}
          fileName={application.cvFileName}
          fileUrl={application.cvFileUrl}
          status={application.cvStatus}
          rejectionReason={application.cvRejectionReason}
          actionable={!isDecided}
          onAccept={() => review('cv', 'Approved')}
          onReject={(reason) => review('cv', 'Rejected', reason)}
        />
        <DocumentReviewRow
          label={t('admin.review.photo')}
          fileName={application.photoFileName}
          fileUrl={application.photoFileUrl}
          status={application.photoStatus}
          rejectionReason={application.photoRejectionReason}
          actionable={!isDecided}
          onAccept={() => review('photo', 'Approved')}
          onReject={(reason) => review('photo', 'Rejected', reason)}
        />
        <DocumentReviewRow
          label={t('admin.review.agreement')}
          fileName={application.agreementFileName}
          fileUrl={application.agreementFileUrl}
          status={application.agreementStatus}
          rejectionReason={application.agreementRejectionReason}
          actionable={!isDecided}
          onAccept={() => review('agreement', 'Approved')}
          onReject={(reason) => review('agreement', 'Rejected', reason)}
        />
        <DocumentReviewRow
          label={t('admin.review.internshipRequest')}
          fileName={application.internshipRequestFileName}
          fileUrl={application.internshipRequestFileUrl}
          status={application.internshipRequestStatus}
          rejectionReason={application.internshipRequestRejectionReason}
          actionable={!isDecided}
          onAccept={() => review('internshipRequest', 'Approved')}
          onReject={(reason) => review('internshipRequest', 'Rejected', reason)}
        />

        {otherDocuments.length > 0 && (
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
            <p className="text-sm font-medium text-foreground">{t('admin.review.additionalDocuments')}</p>
            {otherDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border border-border px-4 py-2.5">
                <span className="text-sm text-muted-foreground">{doc.label}</span>
                <DocumentLink fileName={doc.fileName} url={doc.fileUrl} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
