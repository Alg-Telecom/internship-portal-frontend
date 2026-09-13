import { useEffect } from 'react';
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

const schema = z.object({
  name: z.string().min(1, 'Team name is required.'),
  description: z.string().optional(),
  status: z.string().min(1, 'Status is required.'),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
});

export default function TeamFormDialog({ open, onClose, onSubmit, team }) {
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
    <Dialog open={open} onClose={onClose} title={team ? 'Edit Team' : 'Create Team'}>
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        <Input id="team-name" label="Team name" required error={errors.name?.message} {...register('name')} />
        <Textarea id="team-description" label="Description" {...register('description')} />
        <Select id="team-status" label="Status" required error={errors.status?.message} {...register('status')}>
          {Object.values(TeamStatus).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
        <DateRangePicker
          id="team-dates"
          label="Dates"
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
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {team ? 'Save changes' : 'Create team'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
