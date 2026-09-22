import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WarningCircle, CheckCircle } from '@phosphor-icons/react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    email: z.string().min(1, t('login.emailRequired')).email(t('login.emailInvalid')),
  });
}

export default function ForgotPasswordForm({ onSubmit }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const [formError, setFormError] = useState('');
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function submit(values) {
    setFormError('');
    try {
      await onSubmit(values);
      setSent(true);
    } catch (error) {
      setFormError(error.message || t('common.somethingWentWrong'));
    }
  }

  if (sent) {
    return (
      <div role="status" className="flex items-start gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5 text-sm text-foreground">
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {t('login.forgotPassword.sent')}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
      {formError && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          <WarningCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </div>
      )}
      <Input id="email" type="email" label={t('login.email')} required autoComplete="username" error={errors.email?.message} {...register('email')} />
      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        {t('login.forgotPassword.submit')}
      </Button>
    </form>
  );
}
