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
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Range picker for internship Start date -> End date. */
export default function DateRangePicker({ id, label, required, error, helperText, startValue, endValue, onChange }) {
  const range = { from: toDate(startValue), to: toDate(endValue) };
  const display = startValue && endValue ? `${formatDate(startValue)} → ${formatDate(endValue)}` : startValue ? `${formatDate(startValue)} → …` : '';

  return (
    <Field id={id} label={label} required={required} error={error} helperText={helperText}>
      <Popover className="relative">
        <Popover.Button
          id={id}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-md border border-border bg-card px-3 text-left text-[15px]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring',
            error && 'border-destructive',
            'cursor-pointer'
          )}
        >
          <span className={display ? 'text-foreground' : 'text-muted-foreground'}>{display || 'Start date → End date'}</span>
          <CalendarBlank className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </Popover.Button>
        <Popover.Panel className="absolute z-20 mt-2 rounded-md border border-border bg-card p-3 shadow-popover">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(next) => {
              onChange({ startDate: toIso(next?.from), endDate: toIso(next?.to) });
            }}
          />
        </Popover.Panel>
      </Popover>
    </Field>
  );
}
