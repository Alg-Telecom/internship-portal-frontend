import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import DateRangePicker from '../../../components/ui/DateRangePicker';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    name: z.string().min(1, t('admin.teamForm.nameRequired')),
    nameFr: z.string().optional(),
    nameAr: z.string().optional(),
    description: z.string().optional(),
    startDate: z.string().min(1, t('admin.teamForm.startDateRequired')),
    endDate: z.string().min(1, t('admin.teamForm.endDateRequired')),
  });
}

export default function TeamFormDialog({ open, onClose, onSubmit, team }) {
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
        name: team?.name || '',
        nameFr: team?.nameFr || '',
        nameAr: team?.nameAr || '',
        description: team?.description || '',
        startDate: team?.startDate || '',
        endDate: team?.endDate || '',
      });
    }
  }, [open, team, reset]);

  const startDate = useWatch({ control, name: 'startDate' });
  const endDate = useWatch({ control, name: 'endDate' });

  async function submit(values) {
    await onSubmit(values);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={team ? t('admin.teamForm.editTitle') : t('admin.teamForm.createTitle')}>
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        <Input id="team-name" label={t('admin.teamForm.name')} required helperText={t('admin.teamForm.nameHelper')} error={errors.name?.message} {...register('name')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input id="team-nameFr" label={t('admin.teamForm.nameFr')} placeholder={t('admin.teamForm.nameOptionalPlaceholder')} error={errors.nameFr?.message} {...register('nameFr')} />
          <Input id="team-nameAr" label={t('admin.teamForm.nameAr')} placeholder={t('admin.teamForm.nameOptionalPlaceholder')} dir="rtl" error={errors.nameAr?.message} {...register('nameAr')} />
        </div>
        <Textarea id="team-description" label={t('admin.teamForm.description')} {...register('description')} />
        <DateRangePicker
          id="team-dates"
          label={t('admin.teamForm.dates')}
          required
          helperText={t('admin.teamForm.statusAutoHelper')}
          startValue={startDate}
          endValue={endDate}
          error={errors.startDate?.message || errors.endDate?.message}
          onChange={({ startDate: s, endDate: e }) => {
            setValue('startDate', s, { shouldValidate: true });
            setValue('endDate', e, { shouldValidate: true });
          }}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {team ? t('admin.teamForm.saveChanges') : t('admin.teamForm.createTeam')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
