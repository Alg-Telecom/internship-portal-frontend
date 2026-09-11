import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  setMonth,
  setYear,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  isBefore,
} from 'date-fns';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), 'MMMM'));
const CURRENT_YEAR = new Date().getFullYear();
// Generous range for a birthday field (up to 80 years back), still bounded.
const YEAR_OPTIONS = Array.from({ length: 86 }, (_, i) => CURRENT_YEAR + 5 - i);

/**
 * Small hand-rolled month-grid calendar (no external calendar library —
 * keeps the dependency surface minimal and the rendering fully under our
 * design tokens). Supports single-date selection and a "markers" mode for
 * highlighting arbitrary dates (used by InternshipCalendar/AttendanceCalendar).
 *
 * `mode`: 'single' | 'range' | 'view'
 * `selected`: Date (single) | { from, to } (range)
 * `markers`: [{ date: Date, tone: 'primary'|'accent'|'warning'|'destructive' }]
 */
export default function Calendar({ mode = 'view', selected, onSelect, markers = [], month, onMonthChange, renderDay }) {
  // Open on the already-selected date's month/year (e.g. reopening a
  // Birthday picker after choosing 1998 should land back on 1998, not
  // jump to today) rather than always defaulting to the current month.
  const initialMonth = month || (mode === 'range' ? selected?.from : selected) || new Date();
  const [internalMonth, setInternalMonth] = useState(initialMonth);
  const visibleMonth = month || internalMonth;

  function changeMonth(next) {
    if (onMonthChange) onMonthChange(next);
    else setInternalMonth(next);
  }

  const start = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  function isSelected(day) {
    if (mode === 'single') return selected && isSameDay(day, selected);
    if (mode === 'range' && selected?.from) {
      if (!selected.to) return isSameDay(day, selected.from);
      return isWithinInterval(day, { start: selected.from, end: selected.to });
    }
    return false;
  }

  function handleClick(day) {
    if (!onSelect) return;
    if (mode === 'single') {
      onSelect(day);
      return;
    }
    if (mode === 'range') {
      if (!selected?.from || (selected.from && selected.to)) {
        onSelect({ from: day, to: null });
      } else if (isBefore(day, selected.from)) {
        onSelect({ from: day, to: selected.from });
      } else {
        onSelect({ from: selected.from, to: day });
      }
    }
  }

  const markersByDay = markers.reduce((acc, marker) => {
    const key = format(marker.date, 'yyyy-MM-dd');
    (acc[key] = acc[key] || []).push(marker);
    return acc;
  }, {});

  return (
    <div className="w-[300px]">
      <div className="mb-2 flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={() => changeMonth(subMonths(visibleMonth, 1))}
          aria-label="Previous month"
          className="shrink-0 cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CaretLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <select
            aria-label="Month"
            value={visibleMonth.getMonth()}
            onChange={(e) => changeMonth(setMonth(visibleMonth, Number(e.target.value)))}
            className="min-w-0 flex-1 cursor-pointer rounded-md border border-border bg-card py-1 pl-1.5 pr-1 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={index}>
                {name}
              </option>
            ))}
          </select>
          <select
            aria-label="Year"
            value={visibleMonth.getFullYear()}
            onChange={(e) => changeMonth(setYear(visibleMonth, Number(e.target.value)))}
            className="w-[4.5rem] shrink-0 cursor-pointer rounded-md border border-border bg-card py-1 pl-1.5 pr-1 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => changeMonth(addMonths(visibleMonth, 1))}
          aria-label="Next month"
          className="shrink-0 cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CaretRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayMarkers = markersByDay[format(day, 'yyyy-MM-dd')] || [];
          const outsideMonth = !isSameMonth(day, visibleMonth);
          const selectedDay = isSelected(day);
          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => (onSelect ? handleClick(day) : undefined)}
              className={cn(
                'relative flex h-9 w-9 flex-col items-center justify-center rounded-md text-sm transition-colors',
                onSelect && 'cursor-pointer',
                outsideMonth ? 'text-muted-foreground/50' : 'text-foreground',
                selectedDay ? 'bg-primary text-primary-foreground' : onSelect && 'hover:bg-muted',
                isSameDay(day, new Date()) && !selectedDay && 'ring-1 ring-primary/40',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              {renderDay ? renderDay(day) : format(day, 'd')}
              {dayMarkers.length > 0 && (
                <span className="absolute bottom-0.5 flex gap-0.5" aria-hidden="true">
                  {dayMarkers.slice(0, 3).map((m, i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-1 w-1 rounded-full',
                        m.tone === 'accent' && 'bg-accent',
                        m.tone === 'warning' && 'bg-amber-500',
                        m.tone === 'destructive' && 'bg-destructive',
                        (!m.tone || m.tone === 'primary') && (selectedDay ? 'bg-primary-foreground' : 'bg-primary')
                      )}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
