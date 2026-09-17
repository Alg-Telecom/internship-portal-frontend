import { forwardRef } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import Field from './Field';

/**
 * Native <select> styled to match the design system. A native element is
 * used (over a custom Listbox) so it gets free mobile keyboard/OS picker
 * support and needs no extra ARIA wiring.
 */
const Select = forwardRef(function Select(
  { className, id, label, required, error, helperText, wrapperClassName, placeholder, children, value, ...props },
  ref
) {
  // Only fall back to defaultValue="" when this is truly uncontrolled
  // (e.g. plain react-hook-form `register()` usage, which passes no
  // `value`) — passing both `value` and `defaultValue` trips React's
  // controlled/uncontrolled warning.
  const valueProps = value === undefined ? { defaultValue: '' } : { value };

  return (
    <Field id={id} label={label} required={required} error={error} helperText={helperText} className={wrapperClassName}>
      {/* `className` carries width overrides (e.g. `sm:w-64`) meant for the
          whole control — it has to land on this wrapper too, not just the
          <select>, otherwise the wrapper stays full-width while the select
          shrinks inside it, and the absolutely-positioned caret (anchored
          to the wrapper) ends up stranded far to the right of the actual
          dropdown instead of sitting against its edge. */}
      <div className={cn('relative', className)}>
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...valueProps}
          className={cn(
            'h-11 w-full appearance-none rounded-md border border-border bg-card pl-3 pr-9 text-[15px] text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <CaretDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </Field>
  );
});

export default Select;
