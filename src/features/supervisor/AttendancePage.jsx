import { useState } from 'react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useTeams } from '../../hooks/useTeams';
import { useInterns } from '../../hooks/useUsers';
import { useAttendance } from '../../hooks/useAttendance';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import DatePicker from '../../components/ui/DatePicker';
import AttendanceRecorderGrid from './components/AttendanceRecorderGrid';
import AttendanceCalendar from '../../components/shared/AttendanceCalendar';
import AttendanceHistoryTable from '../../components/shared/AttendanceHistoryTable';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
  usePageHeader('Attendance');
  const { user } = useAuth();
  const { teams } = useTeams();
  const myTeamIds = teams.filter((t) => t.supervisorId === user.id).map((t) => t.id);
  const { interns } = useInterns();
  const myInterns = interns.filter((i) => myTeamIds.includes(i.teamId));

  const [date, setDate] = useState(todayIso());
  const { records, isLoading, refetch } = useAttendance({ supervisorId: user.id });

  const todaysRecords = records.filter((r) => r.date === date);
  const recordsByInternId = Object.fromEntries(todaysRecords.map((r) => [r.internId, r]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          tabs={[
            {
              key: 'record',
              label: 'Record',
              content: (
                <div className="flex flex-col gap-4">
                  <DatePicker id="attendance-date" label="Date" value={date} onChange={setDate} />
                  <AttendanceRecorderGrid interns={myInterns} supervisorId={user.id} date={date} recordsByInternId={recordsByInternId} onSaved={refetch} />
                </div>
              ),
            },
            {
              key: 'calendar',
              label: 'Calendar',
              content: <AttendanceCalendar records={records} />,
            },
            {
              key: 'history',
              label: 'History',
              content: <AttendanceHistoryTable records={records} isLoading={isLoading} />,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
