import { Popover } from '@headlessui/react';
import { CalendarBlank } from '@phosphor-icons/react';
import { cn, formatDate } from '../../lib/utils';
import Field from './Field';
import Calendar from './Calendar';

function toDate(value) {
  return value ? new Date(value + 'T00:00:00') : undefined;
}

function toIso(date) {
  if (!date) return '';
  return format4(date);
}

function format4(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Single-date picker (birthday, deadlines, ...). Value/onChange use ISO `yyyy-mm-dd` strings. */
export default function DatePicker({ id, label, required, error, helperText, value, onChange, placeholder = 'Select date', disabled }) {
  return (
    <Field id={id} label={label} required={required} error={error} helperText={helperText}>
      <Popover className="relative">
        <Popover.Button
          id={id}
          disabled={disabled}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-md border border-border bg-card px-3 text-left text-[15px]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
            error && 'border-destructive',
            'disabled:bg-muted disabled:cursor-not-allowed cursor-pointer'
          )}
        >
          <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{value ? formatDate(value) : placeholder}</span>
          <CalendarBlank className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </Popover.Button>
        <Popover.Panel className="absolute z-20 mt-2 rounded-md border border-border bg-card p-3 shadow-popover">
          {({ close }) => (
            <Calendar
              mode="single"
              selected={toDate(value)}
              onSelect={(date) => {
                onChange(toIso(date));
                close();
              }}
            />
          )}
        </Popover.Panel>
      </Popover>
    </Field>
  );
}
