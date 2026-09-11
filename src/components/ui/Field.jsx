import { cn } from '../../lib/utils';

/**
 * Shared label + helper/error wrapper for every form control. Errors render
 * below the field and are wired via aria-describedby by the caller
 * (Input/Select/Textarea already do this when given `id` + `error`).
 */
export default function Field({ id, label, required, error, helperText, className, children }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
