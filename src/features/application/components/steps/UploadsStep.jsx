import { Plus } from '@phosphor-icons/react';
import FileDropzone from '../../../../components/ui/FileDropzone';
import Button from '../../../../components/ui/Button';
import OptionalDocumentRow from './OptionalDocumentRow';
import { useLanguage } from '../../../../context/LanguageContext';

const MAX_REQUIRED_DOCUMENT_MB = 2;

export default function UploadsStep({ errors, watch, setValue }) {
  const { t } = useLanguage();
  const cvFile = watch('cvFile');
  const photoFile = watch('photoFile');
  const agreementFile = watch('agreementFile');
  const internshipRequestFile = watch('internshipRequestFile');
  const otherDocuments = watch('otherDocuments') || [];

  function updateOtherDocument(index, next) {
    const updated = otherDocuments.map((doc, i) => (i === index ? next : doc));
    setValue('otherDocuments', updated, { shouldValidate: true });
  }

  function addOtherDocument() {
    setValue('otherDocuments', [...otherDocuments, { label: '', file: null }], { shouldValidate: true });
  }

  function removeOtherDocument(index) {
    setValue(
      'otherDocuments',
      otherDocuments.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FileDropzone
          id="cvFile"
          label={t('apply.uploads.cv')}
          required
          accept=".pdf,.doc,.docx"
          hint={t('apply.uploads.cvHint', { max: MAX_REQUIRED_DOCUMENT_MB })}
          maxSizeMB={MAX_REQUIRED_DOCUMENT_MB}
          file={cvFile}
          error={errors.cvFile?.message}
          onChange={(file) => setValue('cvFile', file, { shouldValidate: true })}
        />
        <FileDropzone
          id="photoFile"
          label={t('apply.uploads.photo')}
          required
          accept="image/*"
          hint={t('apply.uploads.photoHint', { max: MAX_REQUIRED_DOCUMENT_MB })}
          maxSizeMB={MAX_REQUIRED_DOCUMENT_MB}
          file={photoFile}
          error={errors.photoFile?.message}
          onChange={(file) => setValue('photoFile', file, { shouldValidate: true })}
        />
        <FileDropzone
          id="agreementFile"
          label={t('apply.uploads.agreement')}
          required
          accept=".pdf,.doc,.docx"
          hint={t('apply.uploads.agreementHint', { max: MAX_REQUIRED_DOCUMENT_MB })}
          maxSizeMB={MAX_REQUIRED_DOCUMENT_MB}
          file={agreementFile}
          error={errors.agreementFile?.message}
          onChange={(file) => setValue('agreementFile', file, { shouldValidate: true })}
        />
        <FileDropzone
          id="internshipRequestFile"
          label={t('apply.uploads.internshipRequest')}
          required
          accept=".pdf,.doc,.docx"
          hint={t('apply.uploads.internshipRequestHint', { max: MAX_REQUIRED_DOCUMENT_MB })}
          maxSizeMB={MAX_REQUIRED_DOCUMENT_MB}
          file={internshipRequestFile}
          error={errors.internshipRequestFile?.message}
          onChange={(file) => setValue('internshipRequestFile', file, { shouldValidate: true })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{t('apply.uploads.additionalDocuments')}</p>
            <p className="text-xs text-muted-foreground">{t('apply.uploads.additionalDocumentsHint')}</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addOtherDocument}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('apply.uploads.addDocument')}
          </Button>
        </div>

        {otherDocuments.map((doc, index) => (
          <OptionalDocumentRow
            key={index}
            index={index}
            value={doc}
            error={errors.otherDocuments?.[index]}
            onChange={(next) => updateOtherDocument(index, next)}
            onRemove={() => removeOtherDocument(index)}
          />
        ))}
      </div>
    </div>
  );
}
