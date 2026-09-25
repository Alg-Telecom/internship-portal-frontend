import { FileText, FileArchive, LinkSimple, ArrowSquareOut } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

/**
 * Renders a file name either as a real, openable link or as plainly
 * non-interactive text, depending on whether a usable `url` exists.
 *
 * There is no backend yet, so "documents" only ever have real bytes
 * behind them when a file was actually picked through the browser
 * (ApplyPage, UploadDocumentDialog, SubmitWorkForm read it into a base64
 * data: URL with `fileToDataUrl` — see lib/utils — so it keeps working
 * after a reload or a new session, unlike `URL.createObjectURL`, which
 * dies with the page that created it). Seeded demo data has no such file
 * behind it, so this deliberately does NOT render those as clickable — a
 * dead link that silently does nothing is worse than a label that's
 * honest about it.
 */
// Icon per upload type (see lib/uploadTypes) — File by default.
const TYPE_ICONS = { File: FileText, Archive: FileArchive, Link: LinkSimple };

export default function DocumentLink({ fileName, url, className, uploadType }) {
  if (!fileName) return null;
  const Icon = TYPE_ICONS[uploadType] || FileText;

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={cn(
          'inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-2 hover:underline',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
          className
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 break-all">{fileName}</span>
        <ArrowSquareOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </a>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm text-muted-foreground', className)}>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {fileName}
      <span className="text-xs italic">(no file to preview)</span>
    </span>
  );
}
