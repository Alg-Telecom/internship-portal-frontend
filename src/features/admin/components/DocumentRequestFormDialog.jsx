import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import DatePicker from '../../../components/ui/DatePicker';
import Button from '../../../components/ui/Button';
import { useInterns } from '../../../hooks/useUsers';
import { fullName } from '../../../lib/utils';

const schema = z.object({
  internId: z.string().min(1, 'Please select an intern.'),
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required.'),
});

export default function DocumentRequestFormDialog({ open, onClose, onSubmit }) {
  const { interns } = useInterns();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { internId: '', title: '', description: '', deadline: '' } });

  const deadline = watch('deadline');

  async function submit(values) {
    await onSubmit({ ...values, internId: Number(values.internId) });
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="New Document Request">
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        <Select id="request-intern" label="Intern" required placeholder="Select an intern" error={errors.internId?.message} {...register('internId')}>
          {interns.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {fullName(intern)}
            </option>
          ))}
        </Select>
        <Input id="request-title" label="Document title" required placeholder="e.g. Signed Internship Agreement" error={errors.title?.message} {...register('title')} />
        <Textarea id="request-description" label="Instructions" {...register('description')} />
        <DatePicker id="request-deadline" label="Deadline" required value={deadline} onChange={(v) => setValue('deadline', v, { shouldValidate: true })} error={errors.deadline?.message} />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Send request
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
