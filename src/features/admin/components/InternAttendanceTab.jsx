import { useAttendance } from '../../../hooks/useAttendance';
import AttendanceHistoryTable from '../../../components/shared/AttendanceHistoryTable';

export default function InternAttendanceTab({ internId }) {
  const { records, isLoading } = useAttendance({ internId });
  return <AttendanceHistoryTable records={records} isLoading={isLoading} />;
}
