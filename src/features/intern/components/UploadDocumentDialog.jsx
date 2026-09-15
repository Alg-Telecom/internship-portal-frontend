import { useState } from 'react';
import Dialog from '../../../components/ui/Dialog';
import FileDropzone from '../../../components/ui/FileDropzone';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { DocumentType } from '../../../domain/enums';
import { fileToDataUrl } from '../../../lib/utils';

export default function UploadDocumentDialog({ open, onClose, request, onSubmit }) {
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState(DocumentType.OTHER);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError('Please attach a file to upload.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const fileUrl = await fileToDataUrl(file);
      await onSubmit({ fileName: file.name, fileUrl, documentType });
      setFile(null);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={request ? `Upload — ${request.title}` : 'Upload document'}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Select id="document-type" label="Document type" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
          {Object.values(DocumentType).map((value) => (
            <option key={value} value={value}>
              {value.replace(/([a-z])([A-Z])/g, '$1 $2')}
            </option>
          ))}
        </Select>
        <FileDropzone id="document-file" label="File" required file={file} error={error} onChange={setFile} hint="PDF, image, or Word, max 10MB" />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Upload
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
