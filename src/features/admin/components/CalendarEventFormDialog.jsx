import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import DatePicker from '../../../components/ui/DatePicker';
import Button from '../../../components/ui/Button';
import { CalendarEventType, CALENDAR_EVENT_TYPE_LABEL } from '../../../domain/enums';
import { toDateInputValue } from '../../../lib/utils';

const schema = z.object({
  title: z.string().min(1, 'Title is required.'),
  date: z.string().min(1, 'Date is required.'),
  type: z.string().min(1, 'Type is required.'),
});

export default function CalendarEventFormDialog({ open, onClose, onSubmit, defaultDate }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        date: defaultDate ? toDateInputValue(defaultDate) : '',
        type: CalendarEventType.EVENT,
      });
    }
  }, [open, defaultDate, reset]);

  const date = watch('date');

  async function submit(values) {
    await onSubmit(values);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="New Calendar Event">
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        <Input id="event-title" label="Title" required placeholder="e.g. Mid-internship review meeting" error={errors.title?.message} {...register('title')} />
        <DatePicker id="event-date" label="Date" required value={date} onChange={(v) => setValue('date', v, { shouldValidate: true })} error={errors.date?.message} />
        <Select id="event-type" label="Type" required error={errors.type?.message} {...register('type')}>
          {Object.values(CalendarEventType).map((value) => (
            <option key={value} value={value}>
              {CALENDAR_EVENT_TYPE_LABEL[value]}
            </option>
          ))}
        </Select>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Add event
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
