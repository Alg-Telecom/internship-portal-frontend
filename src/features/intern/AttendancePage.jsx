import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../hooks/useAttendance';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import AttendanceCalendar from '../../components/shared/AttendanceCalendar';
import AttendanceHistoryTable from '../../components/shared/AttendanceHistoryTable';

export default function AttendancePage() {
  usePageHeader('My Attendance');
  const { user } = useAuth();
  const { records, isLoading } = useAttendance({ internId: user.id });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          tabs={[
            { key: 'calendar', label: 'Calendar', content: <AttendanceCalendar records={records} /> },
            { key: 'history', label: 'History', content: <AttendanceHistoryTable records={records} isLoading={isLoading} /> },
          ]}
        />
      </CardContent>
    </Card>
  );
}
