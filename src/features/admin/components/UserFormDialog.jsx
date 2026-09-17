import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Role } from '../../../domain/enums';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    firstName: z.string().min(1, t('admin.userForm.firstNameRequired')),
    lastName: z.string().min(1, t('admin.userForm.lastNameRequired')),
    email: z.string().min(1, t('admin.userForm.emailRequired')).email(t('admin.userForm.emailInvalid')),
    phoneNumber: z.string().min(1, t('admin.userForm.phoneRequired')),
    role: z.string().min(1, t('admin.userForm.roleRequired')),
  });
}

export default function UserFormDialog({ open, onClose, onSubmit }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { firstName: '', lastName: '', email: '', phoneNumber: '', role: Role.SUPERVISOR } });

  async function submit(values) {
    setSubmitError('');
    try {
      await onSubmit(values);
      reset();
      onClose();
    } catch (error) {
      setSubmitError(error.message || t('admin.userForm.createFailed'));
    }
  }

  function handleClose() {
    setSubmitError('');
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} title={t('admin.userForm.createTitle')} description={t('admin.userForm.createDescription')}>
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        {submitError && (
          <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            {submitError}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Input id="user-firstName" label={t('admin.userForm.firstName')} required error={errors.firstName?.message} {...register('firstName')} />
          <Input id="user-lastName" label={t('admin.userForm.lastName')} required error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input id="user-email" type="email" label={t('admin.userForm.email')} required error={errors.email?.message} {...register('email')} />
        <Input id="user-phone" type="tel" label={t('admin.userForm.phone')} required error={errors.phoneNumber?.message} {...register('phoneNumber')} />
        <Select id="user-role" label={t('admin.userForm.role')} required error={errors.role?.message} {...register('role')}>
          <option value={Role.ADMIN}>{t('admin.userForm.administrator')}</option>
          <option value={Role.SUPERVISOR}>{t('admin.userForm.supervisor')}</option>
        </Select>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {t('admin.userForm.createUser')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
