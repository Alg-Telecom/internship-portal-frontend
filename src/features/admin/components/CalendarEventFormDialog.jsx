import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import DatePicker from '../../../components/ui/DatePicker';
import Button from '../../../components/ui/Button';
import { CalendarEventType } from '../../../domain/enums';
import { toDateInputValue } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    title: z.string().min(1, t('admin.calendarEventForm.titleRequired')),
    date: z.string().min(1, t('admin.calendarEventForm.dateRequired')),
    type: z.string().min(1, t('admin.calendarEventForm.typeRequired')),
  });
}

export default function CalendarEventFormDialog({ open, onClose, onSubmit, defaultDate }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const {
    register,
    handleSubmit,
    reset,
    control,
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

  const date = useWatch({ control, name: 'date' });

  async function submit(values) {
    await onSubmit(values);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('admin.calendarEventForm.title')}>
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        <Input id="event-title" label={t('admin.calendarEventForm.titleField')} required placeholder={t('admin.calendarEventForm.titlePlaceholder')} error={errors.title?.message} {...register('title')} />
        <DatePicker id="event-date" label={t('admin.calendarEventForm.date')} required value={date} onChange={(v) => setValue('date', v, { shouldValidate: true })} error={errors.date?.message} />
        <Select id="event-type" label={t('admin.calendarEventForm.type')} required error={errors.type?.message} {...register('type')}>
          {Object.values(CalendarEventType).map((value) => (
            <option key={value} value={value}>
              {t(`common.calendarEventType.${value}`)}
            </option>
          ))}
        </Select>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {t('admin.calendarEventForm.addEvent')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
