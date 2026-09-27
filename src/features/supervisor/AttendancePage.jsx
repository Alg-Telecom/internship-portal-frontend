import { useState } from 'react';
import { isSameDay } from 'date-fns';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useTeams } from '../../hooks/useTeams';
import { useInterns } from '../../hooks/useUsers';
import { useAttendance } from '../../hooks/useAttendance';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import AttendanceCalendar from '../../components/shared/AttendanceCalendar';
import AttendanceDayList from './components/AttendanceDayList';
import AttendanceEditDialog from './components/AttendanceEditDialog';
import AttendanceHistoryTable from '../../components/shared/AttendanceHistoryTable';
import { toDateInputValue } from '../../lib/utils';
import { useLanguage } from '../../context/LanguageContext';

export default function AttendancePage() {
  const { t } = useLanguage();
  usePageHeader(t('supervisor.attendance.title'));
  const { user } = useAuth();
  const { teams } = useTeams();
  const myTeamIds = teams.filter((tm) => tm.supervisorId === user.id).map((tm) => tm.id);
  const { interns, allInterns } = useInterns();
  const myInterns = interns.filter((i) => myTeamIds.includes(i.teamId));

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingIntern, setEditingIntern] = useState(null);
  const { records, isLoading, refetch } = useAttendance({ supervisorId: user.id });

  // Records for whichever day is selected on the calendar — compared as
  // actual dates, not strings, since the backend returns full ISO
  // datetimes.
  const dayRecords = records.filter((r) => isSameDay(new Date(r.date), selectedDate));
  const recordsByInternId = Object.fromEntries(dayRecords.map((r) => [r.internId, r]));
  const selectedDateIso = toDateInputValue(selectedDate);
  // History mixes records from every intern the supervisor has — pass this
  // so AttendanceHistoryTable adds an Intern column instead of showing a
  // wall of dates with no way to tell whose record is whose.
  // History can include interns deactivated since — look names up among all of them.
  const internsById = Object.fromEntries(allInterns.filter((i) => myTeamIds.includes(i.teamId)).map((i) => [i.id, i]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('supervisor.attendance.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          tabs={[
            {
              key: 'calendar',
              label: t('supervisor.attendance.calendar'),
              content: (
                <div className="flex flex-col gap-5 sm:flex-row">
                  <AttendanceCalendar records={records} selected={selectedDate} onSelect={setSelectedDate} />
                  <div className="min-w-0 flex-1 sm:border-l sm:border-border sm:pl-5">
                    <AttendanceDayList interns={myInterns} recordsByInternId={recordsByInternId} onUpdate={setEditingIntern} />
                  </div>
                </div>
              ),
            },
            {
              key: 'history',
              label: t('supervisor.attendance.history'),
              content: <AttendanceHistoryTable records={records} isLoading={isLoading} internsById={internsById} />,
            },
          ]}
        />
      </CardContent>

      <AttendanceEditDialog
        open={!!editingIntern}
        onClose={() => setEditingIntern(null)}
        intern={editingIntern}
        supervisorId={user.id}
        date={selectedDateIso}
        existingRecord={editingIntern ? recordsByInternId[editingIntern.id] : null}
        onSaved={refetch}
      />
    </Card>
  );
}
