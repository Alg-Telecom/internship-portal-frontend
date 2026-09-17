import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import Calendar from '../ui/Calendar';
import Button from '../ui/Button';
import CalendarEventList from './CalendarEventList';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';
import { useLanguage } from '../../context/LanguageContext';

const TONE_BY_TYPE = { start: 'primary', end: 'accent', holiday: 'warning', event: 'accent' };

/**
 * Read-only everywhere by default (supervisor/admin dashboards). Pass
 * `onAddEvent`/`onDeleteEvent` to turn on management controls — only the
 * admin calendar does, so every other usage is unaffected.
 */
export default function InternshipCalendar({ events: eventsProp, isLoading, onAddEvent, onDeleteEvent }) {
  const { t } = useLanguage();
  const fetched = useCalendarEvents();
  const events = eventsProp || fetched.events;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const markers = events.map((e) => ({ date: new Date(e.date + 'T00:00:00'), tone: TONE_BY_TYPE[e.type] }));

  return (
    <div className="flex flex-col gap-4">
      {onAddEvent && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => onAddEvent(selectedDate)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t('common.newEvent')}
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-5 sm:flex-row">
        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} markers={markers} />
        <div className="min-w-0 flex-1 sm:border-l sm:border-border sm:pl-5">
          {isLoading ? null : <CalendarEventList events={events} selectedDate={selectedDate} onDelete={onDeleteEvent} />}
        </div>
      </div>
    </div>
  );
}
