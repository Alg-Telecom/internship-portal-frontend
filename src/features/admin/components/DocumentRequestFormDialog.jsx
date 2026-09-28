import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    internId: z.string().min(1, t('admin.documentRequestForm.internRequired')),
    title: z.string().min(1, t('admin.documentRequestForm.titleRequired')),
    description: z.string().optional(),
    deadline: z.string().min(1, t('admin.documentRequestForm.deadlineRequired')),
  });
}

export default function DocumentRequestFormDialog({ open, onClose, onSubmit }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const { interns } = useInterns();
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { internId: '', title: '', description: '', deadline: '' } });

  const deadline = useWatch({ control, name: 'deadline' });
  const [submitError, setSubmitError] = useState('');

  async function submit(values) {
    setSubmitError('');
    try {
      await onSubmit({ ...values, internId: Number(values.internId) });
    } catch (err) {
      // Without this a rejected request just left the dialog sitting there
      // with no feedback, as if the button did nothing.
      setSubmitError(err.message || t('admin.documentRequestForm.sendFailed'));
      return;
    }
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={t('admin.documentRequestForm.title')}>
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        <Select id="request-intern" label={t('admin.documentRequestForm.intern')} required placeholder={t('admin.documentRequestForm.selectIntern')} error={errors.internId?.message} {...register('internId')}>
          {interns.map((intern) => (
            <option key={intern.id} value={intern.id}>
              {fullName(intern)}
            </option>
          ))}
        </Select>
        <Input id="request-title" label={t('admin.documentRequestForm.documentTitle')} required placeholder={t('admin.documentRequestForm.titlePlaceholder')} error={errors.title?.message} {...register('title')} />
        <Textarea id="request-description" label={t('admin.documentRequestForm.instructions')} {...register('description')} />
        <DatePicker id="request-deadline" label={t('admin.documentRequestForm.deadline')} required value={deadline} onChange={(v) => setValue('deadline', v, { shouldValidate: true })} error={errors.deadline?.message} />
        {submitError && (
          <p role="alert" className="text-sm text-destructive">
            {submitError}
          </p>
        )}
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {t('admin.documentRequestForm.sendRequest')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
