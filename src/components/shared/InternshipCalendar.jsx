import { useState } from 'react';
import Calendar from '../ui/Calendar';
import CalendarEventList from './CalendarEventList';
import { useCalendarEvents } from '../../hooks/useCalendarEvents';

const TONE_BY_TYPE = { start: 'primary', end: 'accent', holiday: 'warning', event: 'accent' };

export default function InternshipCalendar() {
  const { events } = useCalendarEvents();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const markers = events.map((e) => ({ date: new Date(e.date + 'T00:00:00'), tone: TONE_BY_TYPE[e.type] }));

  return (
    <div className="flex flex-col gap-5 sm:flex-row">
      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} markers={markers} />
      <div className="min-w-0 flex-1 sm:border-l sm:border-border sm:pl-5">
        <CalendarEventList events={events} selectedDate={selectedDate} />
      </div>
    </div>
  );
}
