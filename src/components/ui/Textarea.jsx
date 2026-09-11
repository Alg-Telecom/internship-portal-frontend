import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import Field from './Field';

const Textarea = forwardRef(function Textarea(
  { className, id, label, required, error, helperText, wrapperClassName, rows = 4, ...props },
  ref
) {
  return (
    <Field id={id} label={label} required={required} error={error} helperText={helperText} className={wrapperClassName}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={cn(
          'w-full rounded-md border border-border bg-card px-3 py-2 text-[15px] text-foreground placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        {...props}
      />
    </Field>
  );
});

export default Textarea;
