import { useState } from 'react';
import { Check } from '@phosphor-icons/react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/ui/Avatar';
import { AttendanceStatus } from '../../../domain/enums';
import { fullName } from '../../../lib/utils';
import * as attendanceApi from '../../../services/mockApi/attendanceApi';

function InternRow({ intern, supervisorId, date, existingRecord, onSaved }) {
  const [status, setStatus] = useState(existingRecord?.status || AttendanceStatus.PRESENT);
  const [arrivalTime, setArrivalTime] = useState(existingRecord?.arrivalTime || '08:30');
  const [departureTime, setDepartureTime] = useState(existingRecord?.departureTime || '16:30');
  // Deliberately NOT seeded from existingRecord — this is a fresh "add a
  // note for this save" field, not a persistent editable one. The saved
  // remark is still visible afterwards in the History tab; leaving it
  // pre-filled here made it look "stuck" on every reload/re-record, and
  // clicking Update without touching it would just resave the same text
  // forever. An empty field + Update now clears whatever was there before.
  const [remarks, setRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      await attendanceApi.recordAttendance({
        internId: intern.id,
        supervisorId,
        date,
        status,
        arrivalTime: status === AttendanceStatus.ABSENT ? null : arrivalTime,
        departureTime: status === AttendanceStatus.ABSENT ? null : departureTime,
        remarks,
      });
      setRemarks('');
      onSaved();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar firstName={intern.firstName} lastName={intern.lastName} size="sm" />
        <p className="text-sm font-medium text-foreground">{fullName(intern)}</p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <Select id={`status-${intern.id}`} label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-36">
          {Object.values(AttendanceStatus).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
        {status !== AttendanceStatus.ABSENT && (
          <>
            <Input id={`arrival-${intern.id}`} label="Arrival" type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className="w-32" />
            <Input id={`departure-${intern.id}`} label="Departure" type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="w-32" />
          </>
        )}
        <Input
          id={`remarks-${intern.id}`}
          label="Remarks"
          placeholder="Optional note"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-48"
        />
        <Button size="sm" variant={existingRecord ? 'outline' : 'primary'} onClick={handleSave} isLoading={isSaving}>
          <Check className="h-4 w-4" aria-hidden="true" />
          {existingRecord ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default function AttendanceRecorderGrid({ interns, supervisorId, date, recordsByInternId, onSaved }) {
  if (interns.length === 0) {
    return <p className="text-sm text-muted-foreground">No interns to record attendance for.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {interns.map((intern) => (
        <InternRow key={intern.id} intern={intern} supervisorId={supervisorId} date={date} existingRecord={recordsByInternId[intern.id]} onSaved={onSaved} />
      ))}
    </div>
  );
}
