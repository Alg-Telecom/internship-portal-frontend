import FileDropzone from '../ui/FileDropzone';
import Select from '../ui/Select';
import Input from '../ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { UPLOAD_TYPES, ARCHIVE_ACCEPT, FILE_MAX_MB, ARCHIVE_MAX_MB, isArchiveName } from '../../lib/uploadTypes';

/**
 * Lets an intern pick how to hand in work — a single file, a compressed
 * folder, or a link (GitHub, Google Docs...) — and shows the matching
 * input. Controlled: `value` is { uploadType, file, link } (see
 * lib/uploadTypes#EMPTY_UPLOAD); `onError` reports inline validation
 * problems (e.g. a non-archive dropped as a compressed folder).
 */
export default function UploadTypeField({ id, value, onChange, error, onError, fileLabel, fileHint }) {
  const { t } = useLanguage();
  const { uploadType, file, link } = value;

  function handleFile(picked) {
    // `accept` on the input is only a hint (drag-and-drop ignores it).
    if (picked && uploadType === 'Archive' && !isArchiveName(picked.name)) {
      onChange({ ...value, file: null });
      onError(t('upload.archiveInvalid'));
      return;
    }
    onError('');
    onChange({ ...value, file: picked });
  }

  return (
    <>
      <Select
        id={`${id}-type`}
        label={t('upload.type')}
        value={uploadType}
        onChange={(e) => {
          onError('');
          onChange({ uploadType: e.target.value, file: null, link: '' });
        }}
      >
        {UPLOAD_TYPES.map((type) => (
          <option key={type} value={type}>
            {t(`upload.types.${type}`)}
          </option>
        ))}
      </Select>

      {uploadType === 'Link' ? (
        <Input
          id={`${id}-link`}
          type="url"
          dir="ltr"
          label={t('upload.link')}
          required
          placeholder="https://github.com/..."
          value={link}
          onChange={(e) => onChange({ ...value, link: e.target.value })}
          error={error}
          helperText={t('upload.linkHint')}
        />
      ) : (
        <FileDropzone
          key={uploadType}
          id={`${id}-file`}
          label={uploadType === 'Archive' ? t('upload.attachArchive') : fileLabel}
          required
          file={file}
          error={error}
          onChange={handleFile}
          accept={uploadType === 'Archive' ? ARCHIVE_ACCEPT : undefined}
          hint={uploadType === 'Archive' ? t('upload.archiveHint') : fileHint}
          maxSizeMB={uploadType === 'Archive' ? ARCHIVE_MAX_MB : FILE_MAX_MB}
        />
      )}
    </>
  );
}
