import { useState } from 'react';
import Dialog from '../../../components/ui/Dialog';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { AttendanceStatus } from '../../../domain/enums';
import { fullName, formatDate } from '../../../lib/utils';
import { useMarkAttendance } from '../../../hooks/useAttendance';
import { useToast } from '../../../context/ToastContext';
import { useLanguage } from '../../../context/LanguageContext';

/**
 * Opened from AttendanceDayList's "Update" button — records or edits ONE
 * intern's attendance for the currently-selected calendar day. Unlike the
 * old always-visible grid row, this is an explicit "edit this one" action,
 * so (unlike that grid, which deliberately never pre-filled remarks) it's
 * fine — expected, even — to re-open showing exactly what's already saved.
 */
export default function AttendanceEditDialog({ open, onClose, intern, supervisorId, date, existingRecord, onSaved }) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const markAttendance = useMarkAttendance();
  const [status, setStatus] = useState(AttendanceStatus.PRESENT);
  const [arrivalTime, setArrivalTime] = useState('08:30');
  const [departureTime, setDepartureTime] = useState('16:30');
  const [remarks, setRemarks] = useState('');

  // Fill the form with what's saved each time the dialog opens (or the
  // record behind it changes) — done during render, not in an effect.
  const resetKey = open
    ? `open:${intern?.id}:${date}:${existingRecord?.id ?? 'new'}:${existingRecord?.status ?? ''}:${existingRecord?.arrivalTime ?? ''}:${existingRecord?.departureTime ?? ''}:${existingRecord?.remarks ?? ''}`
    : 'closed';
  const [lastResetKey, setLastResetKey] = useState(null);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    if (open) {
      setStatus(existingRecord?.status || AttendanceStatus.PRESENT);
      setArrivalTime(existingRecord?.arrivalTime || '08:30');
      setDepartureTime(existingRecord?.departureTime || '16:30');
      setRemarks(existingRecord?.remarks || '');
    }
  }

  if (!intern) return null;

  async function handleSave() {
    try {
      await markAttendance.mutateAsync({
        internId: intern.id,
        supervisorId,
        date,
        status,
        arrivalTime: status === AttendanceStatus.ABSENT ? null : arrivalTime,
        departureTime: status === AttendanceStatus.ABSENT ? null : departureTime,
        remarks,
      });
      showToast(t('supervisor.attendance.saved'));
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.message, { type: 'error' });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('supervisor.attendance.editTitle', { name: fullName(intern) })}
      description={t('supervisor.attendance.editDescription', { date: formatDate(date) })}
    >
      <div className="flex flex-col gap-4">
        <Select id="attendance-status" label={t('supervisor.attendance.status')} value={status} onChange={(e) => setStatus(e.target.value)}>
          {Object.values(AttendanceStatus).map((value) => (
            <option key={value} value={value}>
              {t(`status.${value}`)}
            </option>
          ))}
        </Select>
        {status !== AttendanceStatus.ABSENT && (
          <div className="grid grid-cols-2 gap-3">
            <Input id="attendance-arrival" label={t('supervisor.attendance.arrival')} type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
            <Input id="attendance-departure" label={t('supervisor.attendance.departure')} type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
          </div>
        )}
        <Input
          id="attendance-remarks"
          label={t('supervisor.attendance.remarks')}
          placeholder={t('supervisor.attendance.remarksPlaceholder')}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={markAttendance.isPending}>
            {t('common.cancel')}
          </Button>
          <Button type="button" onClick={handleSave} isLoading={markAttendance.isPending}>
            {t('supervisor.attendance.save')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
