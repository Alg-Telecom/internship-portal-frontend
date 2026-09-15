import { isSameDay } from 'date-fns';
import { ClipboardText } from '@phosphor-icons/react';
import { formatDate, fullName } from '../../lib/utils';
import StatusBadge from './StatusBadge';
import Badge from '../ui/Badge';
import EmptyState from './EmptyState';

/**
 * Assignments due on the selected calendar day — the deadline-view
 * counterpart to CalendarEventList. `internsById` is only needed on the
 * supervisor side, where one day can list assignments across several
 * interns and each row should say whose it is.
 */
export default function AssignmentDayList({ assignments, selectedDate, internsById, onSelect }) {
  const dayAssignments = assignments.filter((a) => isSameDay(new Date(a.deadline + 'T00:00:00'), selectedDate));

  if (dayAssignments.length === 0) {
    return <EmptyState icon={ClipboardText} title="No deadlines" description={`Nothing due on ${formatDate(selectedDate)}.`} />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {dayAssignments.map((assignment) => (
        <li key={assignment.id} className="rounded-md border border-border px-3 py-2.5">
          <button
            type="button"
            onClick={() => onSelect?.(assignment)}
            className={onSelect ? 'w-full cursor-pointer text-left' : 'w-full text-left'}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{assignment.title}</p>
              <StatusBadge status={assignment.status} />
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Badge>{assignment.priority}</Badge>
              {internsById && (
                <p className="text-xs text-muted-foreground">{fullName(internsById[assignment.internId]) || 'Unknown intern'}</p>
              )}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
