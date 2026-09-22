import { useState } from 'react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../hooks/useAttendance';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import AttendanceCalendar from '../../components/shared/AttendanceCalendar';
import AttendanceHistoryTable from '../../components/shared/AttendanceHistoryTable';
import InternshipCalendar from '../../components/shared/InternshipCalendar';
import AttendanceDayDetail from './components/AttendanceDayDetail';
import { useLanguage } from '../../context/LanguageContext';

export default function AttendancePage() {
  const { t } = useLanguage();
  usePageHeader(t('intern.attendance.title'));
  const { user } = useAuth();
  const { records, isLoading } = useAttendance({ internId: user.id });
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('intern.attendance.attendance')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          tabs={[
            {
              key: 'calendar',
              label: t('intern.attendance.calendar'),
              // Clickable now (selecting a day doesn't do anything
              // destructive here — it's read-only for interns — but it
              // matches how every other calendar in the app behaves and
              // highlights the day you're looking at). The panel beside it
              // shows that day's actual attendance status.
              content: (
                <div className="flex flex-col gap-5 sm:flex-row">
                  <AttendanceCalendar records={records} selected={selectedDate} onSelect={setSelectedDate} />
                  <div className="min-w-0 flex-1 sm:border-l sm:border-border sm:pl-5">
                    <AttendanceDayDetail records={records} selectedDate={selectedDate} />
                  </div>
                </div>
              ),
            },
            {
              // The general internship calendar (start/end dates, holidays,
              // events) that admins/supervisors set — interns had no way to
              // see it at all before. Read-only here: no onAddEvent/
              // onDeleteEvent passed, so InternshipCalendar shows the
              // "new event" button/delete controls to nobody but admins.
              key: 'events',
              label: t('intern.attendance.events'),
              content: <InternshipCalendar />,
            },
            { key: 'history', label: t('intern.attendance.history'), content: <AttendanceHistoryTable records={records} isLoading={isLoading} /> },
          ]}
        />
      </CardContent>
    </Card>
  );
}
