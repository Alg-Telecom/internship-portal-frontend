import { useRef, useState } from 'react';
import { UploadSimple, FileText, X } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import Field from './Field';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Accepts a single file via click or drag-and-drop and hands the File
 * object to `onChange`; the form then uploads it to the backend (multer).
 *
 * `maxSizeMB`, when given, rejects an oversized pick/drop right away with
 * a clear message, instead of letting the upload fail later on the
 * server's own size limit.
 */
export default function FileDropzone({ id, label, required, error, helperText, accept, file, onChange, hint, maxSizeMB }) {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState('');

  function handleFiles(fileList) {
    const picked = fileList?.[0];
    if (!picked) return;
    if (maxSizeMB && picked.size > maxSizeMB * 1024 * 1024) {
      setSizeError(t('fileDropzone.sizeError', { name: picked.name, size: (picked.size / (1024 * 1024)).toFixed(1), max: maxSizeMB }));
      return;
    }
    setSizeError('');
    onChange(picked);
  }

  return (
    <Field id={id} label={label} required={required} error={error || sizeError} helperText={helperText}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/40',
          (error || sizeError) && 'border-destructive'
        )}
      >
        {file ? (
          // min-w-0 on the row + truncate on the name is what keeps the
          // remove button reachable — without it a long file name simply
          // pushed the button past the dropzone's edge, off-screen and
          // unclickable, instead of the row shrinking to fit.
          <div className="flex w-full min-w-0 items-center gap-3">
            <FileText className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground" title={file.name}>
              {file.name}
            </span>
            <button
              type="button"
              onClick={() => {
                setSizeError('');
                onChange(null);
              }}
              aria-label={t('fileDropzone.removeFile', { name: file.name })}
              className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <UploadSimple className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              {t('common.dragAndDrop')}{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {t('common.browse')}
              </button>
            </p>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-invalid={!!(error || sizeError)}
        />
      </div>
    </Field>
  );
}
