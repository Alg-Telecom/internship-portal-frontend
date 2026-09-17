import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../hooks/useAttendance';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import AttendanceCalendar from '../../components/shared/AttendanceCalendar';
import AttendanceHistoryTable from '../../components/shared/AttendanceHistoryTable';
import { useLanguage } from '../../context/LanguageContext';

export default function AttendancePage() {
  const { t } = useLanguage();
  usePageHeader(t('intern.attendance.title'));
  const { user } = useAuth();
  const { records, isLoading } = useAttendance({ internId: user.id });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('intern.attendance.attendance')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          tabs={[
            { key: 'calendar', label: t('intern.attendance.calendar'), content: <AttendanceCalendar records={records} /> },
            { key: 'history', label: t('intern.attendance.history'), content: <AttendanceHistoryTable records={records} isLoading={isLoading} /> },
          ]}
        />
      </CardContent>
    </Card>
  );
}
