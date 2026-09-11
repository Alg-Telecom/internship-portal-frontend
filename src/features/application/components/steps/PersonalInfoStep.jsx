import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import Input from '../../../../components/ui/Input';
import DatePicker from '../../../../components/ui/DatePicker';

export default function PersonalInfoStep({ register, errors, control }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input id="firstName" label="Name" required error={errors.firstName?.message} {...register('firstName')} />
      <Input id="lastName" label="Last Name" required error={errors.lastName?.message} {...register('lastName')} />
      <Input id="personalId" label="Personal ID" required error={errors.personalId?.message} {...register('personalId')} />
      <Input id="email" type="email" label="E-mail" required autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Input id="phone" type="tel" label="Tel" required autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
      <Controller
        name="birthday"
        control={control}
        render={({ field }) => (
          <DatePicker id="birthday" label="Birthday" required value={field.value} onChange={field.onChange} error={errors.birthday?.message} />
        )}
      />
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          required
          autoComplete="new-password"
          helperText={!errors.password ? 'At least 8 characters. This will be your login password once accepted.' : undefined}
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
      <div className="relative">
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((v) => !v)}
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-9 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          {showConfirmPassword ? <EyeSlash className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
