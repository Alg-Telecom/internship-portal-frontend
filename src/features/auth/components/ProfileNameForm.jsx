import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    firstName: z.string().min(1, t('settings.firstNameRequired')),
    lastName: z.string().min(1, t('settings.lastNameRequired')),
  });
}

export default function ProfileNameForm({ user, onSubmit }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: user.firstName, lastName: user.lastName },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex max-w-sm flex-col gap-4">
      <Input id="firstName" label={t('settings.firstName')} required error={errors.firstName?.message} {...register('firstName')} />
      <Input id="lastName" label={t('settings.lastName')} required error={errors.lastName?.message} {...register('lastName')} />
      <Button type="submit" isLoading={isSubmitting} disabled={!isDirty} className="mt-2 self-start">
        {t('settings.saveName')}
      </Button>
    </form>
  );
}
