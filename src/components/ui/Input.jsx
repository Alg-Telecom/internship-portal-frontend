import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import Field from './Field';

const Input = forwardRef(function Input(
  { className, id, label, required, error, helperText, wrapperClassName, ...props },
  ref
) {
  return (
    <Field id={id} label={label} required={required} error={error} helperText={helperText} className={wrapperClassName}>
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={cn(
          'h-11 w-full rounded-md border border-border bg-card px-3 text-[15px] text-foreground placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
          error && 'border-destructive focus-visible:ring-destructive',
          'disabled:bg-muted disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    </Field>
  );
});

export default Input;
