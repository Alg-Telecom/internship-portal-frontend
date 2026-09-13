import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeSlash, WarningCircle } from '@phosphor-icons/react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const schema = z.object({
  email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function LoginForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function submit(values) {
    setFormError('');
    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(error.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
      {formError && (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          <WarningCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {formError}
        </div>
      )}
      <Input id="email" type="email" label="Email" required autoComplete="username" error={errors.email?.message} {...register('email')} />
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          required
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-9 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeSlash className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
      <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
        Sign in
      </Button>
    </form>
  );
}
