import { isSameDay } from 'date-fns';
import { CalendarCheck } from '@phosphor-icons/react';
import StatusBadge from '../../../components/shared/StatusBadge';
import EmptyState from '../../../components/shared/EmptyState';
import { formatDate } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * Read-only detail panel next to the intern's attendance calendar — shows
 * the status/arrival/departure/remarks for whichever day is selected, or
 * an empty state if nothing was recorded that day.
 */
export default function AttendanceDayDetail({ records, selectedDate }) {
  const { t } = useLanguage();
  const record = records.find((r) => isSameDay(new Date(r.date), selectedDate));

  if (!record) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title={t('intern.attendance.notRecorded')}
        description={t('intern.attendance.noRecordDescription', { date: formatDate(selectedDate) })}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{formatDate(record.date)}</p>
        <StatusBadge status={record.status} />
      </div>
      {(record.arrivalTime || record.departureTime) && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t('common.field.arrival')}</p>
            <p className="text-foreground">{record.arrivalTime || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t('common.field.departure')}</p>
            <p className="text-foreground">{record.departureTime || '—'}</p>
          </div>
        </div>
      )}
      {record.remarks && (
        <div>
          <p className="text-xs text-muted-foreground">{t('common.field.remarks')}</p>
          <p className="text-sm text-foreground">{record.remarks}</p>
        </div>
      )}
    </div>
  );
}
