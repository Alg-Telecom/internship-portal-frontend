import { useState } from 'react';
import Calendar from '../ui/Calendar';
import AssignmentDayList from './AssignmentDayList';

const TONE_BY_PRIORITY = { Low: 'primary', Medium: 'warning', High: 'destructive' };

/**
 * Deadline calendar for assignments — one shared component for both
 * roles: the intern's own assignments, or (via `internsById`) a
 * supervisor's assignments across every intern on their teams.
 */
export default function AssignmentCalendar({ assignments, internsById, onSelectAssignment }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const markers = assignments.map((a) => ({ date: new Date(a.deadline + 'T00:00:00'), tone: TONE_BY_PRIORITY[a.priority] }));

  return (
    <div className="flex flex-col gap-5 sm:flex-row">
      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} markers={markers} />
      <div className="min-w-0 flex-1 sm:border-l sm:border-border sm:pl-5">
        <AssignmentDayList assignments={assignments} selectedDate={selectedDate} internsById={internsById} onSelect={onSelectAssignment} />
      </div>
    </div>
  );
}
