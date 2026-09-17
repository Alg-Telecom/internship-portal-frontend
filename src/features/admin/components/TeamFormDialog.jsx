import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import DateRangePicker from '../../../components/ui/DateRangePicker';
import Button from '../../../components/ui/Button';
import { TeamStatus } from '../../../domain/enums';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    name: z.string().min(1, t('admin.teamForm.nameRequired')),
    nameFr: z.string().optional(),
    nameAr: z.string().optional(),
    description: z.string().optional(),
    status: z.string().min(1, t('admin.teamForm.statusRequired')),
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
    watch,
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
        status: team?.status || TeamStatus.PLANNED,
        startDate: team?.startDate || '',
        endDate: team?.endDate || '',
      });
    }
  }, [open, team, reset]);

  const startDate = watch('startDate');
  const endDate = watch('endDate');

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
        <Select id="team-status" label={t('admin.teamForm.status')} required error={errors.status?.message} {...register('status')}>
          {Object.values(TeamStatus).map((value) => (
            <option key={value} value={value}>
              {t(`status.${value}`)}
            </option>
          ))}
        </Select>
        <DateRangePicker
          id="team-dates"
          label={t('admin.teamForm.dates')}
          required
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
