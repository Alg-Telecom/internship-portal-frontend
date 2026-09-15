import { useState } from "react";
import { usePageHeader } from "../../context/PageTitleContext";
import { useAuth } from "../../context/AuthContext";
import { useDocumentRequests } from "../../hooks/useDocuments";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/shared/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { FolderSimple } from "@phosphor-icons/react";
import DocumentRequestCard from "./components/DocumentRequestCard";
import UploadDocumentDialog from "./components/UploadDocumentDialog";
import * as documentsApi from "../../services/mockApi/documentsApi";

export default function DocumentsPage() {
  usePageHeader("Documents");
  const { user } = useAuth();
  const { requests, isLoading, refetch } = useDocumentRequests({
    internId: user.id,
  });
  const { showToast } = useToast();
  const [uploadingRequest, setUploadingRequest] = useState(null);

  async function handleUpload({ fileName, fileUrl, documentType }) {
    await documentsApi.uploadDocument(uploadingRequest.id, {
      fileName,
      fileUrl,
      documentType,
      internId: user.id,
    });
    showToast("Document submitted for review.");
    refetch();
  }

  if (isLoading) return <SkeletonRows rows={4} />;

  return (
    <div className="flex flex-col gap-4">
      {requests.length === 0 ? (
        <EmptyState
          icon={FolderSimple}
          title="No document requests"
          description="Requests from the administration will appear here."
        />
      ) : (
        requests.map((request) => (
          <DocumentRequestCard
            key={request.id}
            request={request}
            onUpload={() => setUploadingRequest(request)}
          />
        ))
      )}

      <UploadDocumentDialog
        open={!!uploadingRequest}
        onClose={() => setUploadingRequest(null)}
        request={uploadingRequest}
        onSubmit={handleUpload}
      />
    </div>
  );
}
