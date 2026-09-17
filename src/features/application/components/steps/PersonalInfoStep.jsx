import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import Input from '../../../../components/ui/Input';
import DatePicker from '../../../../components/ui/DatePicker';
import { useLanguage } from '../../../../context/LanguageContext';

export default function PersonalInfoStep({ register, errors, control }) {
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input id="firstName" label={t('apply.personal.firstName')} required error={errors.firstName?.message} {...register('firstName')} />
      <Input id="lastName" label={t('apply.personal.lastName')} required error={errors.lastName?.message} {...register('lastName')} />
      <Input id="personalId" label={t('apply.personal.personalId')} required error={errors.personalId?.message} {...register('personalId')} />
      <Input id="email" type="email" label={t('apply.personal.email')} required autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Input id="phone" type="tel" label={t('apply.personal.phone')} required autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
      <Controller
        name="birthday"
        control={control}
        render={({ field }) => (
          <DatePicker id="birthday" label={t('apply.personal.birthday')} required value={field.value} onChange={field.onChange} error={errors.birthday?.message} />
        )}
      />
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          label={t('apply.personal.password')}
          required
          autoComplete="new-password"
          helperText={!errors.password ? t('apply.personal.passwordHelper') : undefined}
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? t('apply.personal.hidePassword') : t('apply.personal.showPassword')}
          className="absolute end-3 top-9 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeSlash className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
      <div className="relative">
        <Input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          label={t('apply.personal.confirmPassword')}
          required
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword((v) => !v)}
          aria-label={showConfirmPassword ? t('apply.personal.hidePassword') : t('apply.personal.showPassword')}
          className="absolute end-3 top-9 cursor-pointer text-muted-foreground hover:text-foreground"
        >
          {showConfirmPassword ? <EyeSlash className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
