import Drawer from '../../../components/ui/Drawer';
import { useAssignments } from '../../../hooks/useAssignments';
import { useAttendance } from '../../../hooks/useAttendance';
import StatusBadge from '../../../components/shared/StatusBadge';
import { formatDate, fullName } from '../../../lib/utils';

export default function InternProgressDrawer({ intern, onClose }) {
  const { assignments } = useAssignments({ internId: intern?.id });
  const { records } = useAttendance({ internId: intern?.id });

  const presentCount = records.filter((r) => r.status === 'Present').length;
  const attendanceRate = records.length ? Math.round((presentCount / records.length) * 100) : null;

  return (
    <Drawer open={!!intern} onClose={onClose} title={intern ? fullName(intern) : ''}>
      {intern && (
        <div className="flex flex-col gap-6">
          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Attendance</h3>
            <p className="text-sm text-muted-foreground">
              {attendanceRate != null ? `${attendanceRate}% present over the last ${records.length} recorded days.` : 'No attendance recorded yet.'}
            </p>
          </section>
          <section>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Assignments</h3>
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No assignments yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {assignments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">Due {formatDate(a.deadline)}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </Drawer>
  );
}
