import { ClipboardText } from '@phosphor-icons/react';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import StatusBadge from '../../../components/shared/StatusBadge';
import EmptyState from '../../../components/shared/EmptyState';
import { fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * The day-list counterpart to AssignmentDayList/CalendarEventList — one
 * row per intern, showing their attendance status for the selected
 * calendar day ("Not recorded" if nobody's marked one yet), with an
 * Update button that opens AttendanceEditDialog for that intern+day.
 * Replaces the old always-on-screen recorder grid: recording/editing now
 * only happens through this explicit per-day, per-intern action.
 */
export default function AttendanceDayList({ interns, recordsByInternId, onUpdate }) {
  const { t } = useLanguage();

  if (interns.length === 0) {
    return <EmptyState icon={ClipboardText} title={t('supervisor.attendance.noInterns')} />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {interns.map((intern) => {
        const record = recordsByInternId[intern.id];
        const times = record ? [record.arrivalTime, record.departureTime].filter(Boolean).join(' – ') : '';
        return (
          <li key={intern.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
            <div className="flex items-center gap-3">
              <Avatar firstName={intern.firstName} lastName={intern.lastName} photoUrl={intern.profilePhotoUrl} size="sm" />
              <div>
                <p className="text-sm font-medium text-foreground">{fullName(intern)}</p>
                {times && <p className="text-xs text-muted-foreground">{times}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {record ? <StatusBadge status={record.status} /> : <Badge tone="muted">{t('supervisor.attendance.notRecorded')}</Badge>}
              <Button size="sm" variant="outline" onClick={() => onUpdate(intern)}>
                {t('supervisor.attendance.update')}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
