import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WarningCircle } from '@phosphor-icons/react';
import PasswordInput from '../../../components/ui/PasswordInput';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z
    .object({
      currentPassword: z.string().min(1, t('settings.currentPasswordRequired')),
      newPassword: z.string().min(8, t('settings.newPasswordMin')),
      confirmPassword: z.string().min(1, t('settings.confirmPasswordRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('settings.passwordsDontMatch'),
    });
}

export default function ChangePasswordForm({ onSubmit }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function submit(values) {
    setFormError('');
    try {
      await onSubmit(values);
      reset();
    } catch (error) {
      setFormError(error.message || t('common.somethingWentWrong'));
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex max-w-sm flex-col gap-4">
      {formError && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          <WarningCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </div>
      )}
      <PasswordInput id="currentPassword" label={t('settings.currentPassword')} required autoComplete="current-password" error={errors.currentPassword?.message} {...register('currentPassword')} />
      <PasswordInput
        id="newPassword"
        label={t('settings.newPassword')}
        required
        autoComplete="new-password"
        helperText={!errors.newPassword ? t('settings.passwordHelper') : undefined}
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <PasswordInput id="confirmPassword" label={t('settings.confirmNewPassword')} required autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <Button type="submit" isLoading={isSubmitting} className="mt-2 self-start">
        {t('settings.updatePassword')}
      </Button>
    </form>
  );
}
