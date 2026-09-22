import Calendar from '../ui/Calendar';

const TONE_BY_STATUS = { Present: 'accent', Late: 'warning', Absent: 'destructive', Justified: 'primary' };

/** Month view marking each recorded day with a color matching its AttendanceStatus. */
export default function AttendanceCalendar({ records, selected, onSelect }) {
  const markers = records.map((r) => ({ date: new Date(r.date), tone: TONE_BY_STATUS[r.status] }));
  return <Calendar mode={onSelect ? 'single' : 'view'} selected={selected} onSelect={onSelect} markers={markers} />;
}
