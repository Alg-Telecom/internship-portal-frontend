import { TrashSimple } from '@phosphor-icons/react';
import Input from '../../../../components/ui/Input';
import FileDropzone from '../../../../components/ui/FileDropzone';
import { useLanguage } from '../../../../context/LanguageContext';

const MAX_OTHER_DOCUMENT_MB = 2;

/** One row of the optional "other documents" list — a name plus a file, and a way to remove the whole row. */
export default function OptionalDocumentRow({ index, value, error, onChange, onRemove }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-3 rounded-md border border-border p-3 sm:flex-row sm:items-start">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          id={`otherDocuments.${index}.label`}
          label={t('apply.uploads.documentName')}
          placeholder={t('apply.uploads.documentNamePlaceholder')}
          required
          value={value.label}
          error={error?.label?.message}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
        />
        <FileDropzone
          id={`otherDocuments.${index}.file`}
          label={t('apply.uploads.file')}
          required
          file={value.file}
          error={error?.file?.message}
          onChange={(file) => onChange({ ...value, file })}
          hint={t('apply.uploads.maxSize', { max: MAX_OTHER_DOCUMENT_MB })}
          maxSizeMB={MAX_OTHER_DOCUMENT_MB}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={t('apply.uploads.removeDocument')}
        className="shrink-0 cursor-pointer self-start rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:mt-6"
      >
        <TrashSimple className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
