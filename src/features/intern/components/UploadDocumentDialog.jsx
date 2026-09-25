import { useState } from 'react';
import Dialog from '../../../components/ui/Dialog';
import UploadTypeField from '../../../components/shared/UploadTypeField';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { DocumentType } from '../../../domain/enums';
import { useLanguage } from '../../../context/LanguageContext';
import { EMPTY_UPLOAD, validateUpload } from '../../../lib/uploadTypes';

export default function UploadDocumentDialog({ open, onClose, request, onSubmit }) {
  const { t } = useLanguage();
  const [upload, setUpload] = useState(EMPTY_UPLOAD);
  const [documentType, setDocumentType] = useState(DocumentType.OTHER);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const invalid = validateUpload(upload);
    if (invalid) {
      setError(t(invalid));
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ ...upload, documentType });
      setUpload(EMPTY_UPLOAD);
      onClose();
    } catch (err) {
      setError(err.message || t('intern.documents.uploadFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={request ? t('intern.documents.uploadTitle', { title: request.title }) : t('intern.documents.uploadDialogTitle')}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Select id="document-type" label={t('intern.documents.documentType')} value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
          {Object.values(DocumentType).map((value) => (
            <option key={value} value={value}>
              {t(`common.documentType.${value}`)}
            </option>
          ))}
        </Select>
        <UploadTypeField
          id="document"
          value={upload}
          onChange={setUpload}
          error={error}
          onError={setError}
          fileLabel={t('intern.documents.file')}
          fileHint={t('intern.documents.fileHint')}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {t('intern.documents.upload')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
