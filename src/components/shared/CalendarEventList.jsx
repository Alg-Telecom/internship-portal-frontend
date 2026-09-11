import { isSameDay } from 'date-fns';
import { formatDate } from '../../lib/utils';
import EmptyState from './EmptyState';
import { CalendarBlank } from '@phosphor-icons/react';

const TYPE_LABEL = { start: 'Internship start', end: 'Internship end', holiday: 'Public holiday', event: 'Event' };

export default function CalendarEventList({ events, selectedDate }) {
  const dayEvents = events.filter((e) => isSameDay(new Date(e.date + 'T00:00:00'), selectedDate));

  if (dayEvents.length === 0) {
    return <EmptyState icon={CalendarBlank} title="No events" description={`Nothing scheduled for ${formatDate(selectedDate)}.`} />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {dayEvents.map((event) => (
        <li key={event.id} className="rounded-md border border-border px-3 py-2.5">
          <p className="text-sm font-medium text-foreground">{event.title}</p>
          <p className="text-xs text-muted-foreground">{TYPE_LABEL[event.type] || event.type}</p>
        </li>
      ))}
    </ul>
  );
}
