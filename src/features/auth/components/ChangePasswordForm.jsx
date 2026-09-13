import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WarningCircle } from '@phosphor-icons/react';
import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export default function ChangePasswordForm({ onSubmit }) {
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
      setFormError(error.message || 'Something went wrong. Please try again.');
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
      <Input id="currentPassword" type="password" label="Current password" required autoComplete="current-password" error={errors.currentPassword?.message} {...register('currentPassword')} />
      <Input
        id="newPassword"
        type="password"
        label="New password"
        required
        autoComplete="new-password"
        helperText={!errors.newPassword ? 'At least 8 characters.' : undefined}
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <Input id="confirmPassword" type="password" label="Confirm new password" required autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
      <Button type="submit" isLoading={isSubmitting} className="mt-2 self-start">
        Update password
      </Button>
    </form>
  );
}
