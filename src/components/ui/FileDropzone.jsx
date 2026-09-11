import { useRef, useState } from 'react';
import { UploadSimple, FileText, X } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import Field from './Field';

/**
 * Accepts a single file via click or drag-and-drop. Only file metadata +
 * an object URL preview are kept client-side — real storage happens once
 * the Express/multer backend exists (see services/mockApi/documentsApi.js).
 */
export default function FileDropzone({ id, label, required, error, helperText, accept, file, onChange, hint }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(fileList) {
    const picked = fileList?.[0];
    if (picked) onChange(picked);
  }

  return (
    <Field id={id} label={label} required={required} error={error} helperText={helperText}>
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
          error && 'border-destructive'
        )}
      >
        {file ? (
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">{file.name}</span>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={`Remove ${file.name}`}
              className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <>
            <UploadSimple className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Drag & drop, or{' '}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                browse
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
          aria-invalid={!!error}
        />
      </div>
    </Field>
  );
}
