import { isSameDay } from 'date-fns';
import { CalendarBlank, TrashSimple } from '@phosphor-icons/react';
import { formatDate } from '../../lib/utils';
import { CALENDAR_EVENT_TYPE_LABEL } from '../../domain/enums';
import EmptyState from './EmptyState';

/** `onDelete(event)` is optional — pass it only where deleting events makes sense (admin). */
export default function CalendarEventList({ events, selectedDate, onDelete }) {
  const dayEvents = events.filter((e) => isSameDay(new Date(e.date + 'T00:00:00'), selectedDate));

  if (dayEvents.length === 0) {
    return <EmptyState icon={CalendarBlank} title="No events" description={`Nothing scheduled for ${formatDate(selectedDate)}.`} />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {dayEvents.map((event) => (
        <li key={event.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
          <div>
            <p className="text-sm font-medium text-foreground">{event.title}</p>
            <p className="text-xs text-muted-foreground">{CALENDAR_EVENT_TYPE_LABEL[event.type] || event.type}</p>
          </div>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(event)}
              aria-label={`Delete ${event.title}`}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <TrashSimple className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
