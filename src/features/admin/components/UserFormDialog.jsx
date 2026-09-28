import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Role } from '../../../domain/enums';
import { useTeams } from '../../../hooks/useTeams';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    firstName: z.string().min(1, t('admin.userForm.firstNameRequired')),
    lastName: z.string().min(1, t('admin.userForm.lastNameRequired')),
    email: z.string().min(1, t('admin.userForm.emailRequired')).email(t('admin.userForm.emailInvalid')),
    phoneNumber: z.string().min(1, t('admin.userForm.phoneRequired')),
    role: z.string().min(1, t('admin.userForm.roleRequired')),
    // Intern-only fields — required only when the role is Intern (below).
    studentId: z.string().optional(),
    university: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    academicLevel: z.string().optional(),
    teamId: z.string().optional(),
  }).superRefine((values, ctx) => {
    if (values.role !== Role.INTERN) return;
    if (!values.studentId?.trim()) ctx.addIssue({ code: 'custom', path: ['studentId'], message: t('admin.userForm.studentIdRequired') });
    if (!values.university?.trim()) ctx.addIssue({ code: 'custom', path: ['university'], message: t('admin.userForm.universityRequired') });
  });
}

const INTERN_FIELDS = ['studentId', 'university', 'fieldOfStudy', 'academicLevel', 'teamId'];

export default function UserFormDialog({ open, onClose, onSubmit }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const [submitError, setSubmitError] = useState('');
  const { teams } = useTeams();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', phoneNumber: '', role: Role.SUPERVISOR, studentId: '', university: '', fieldOfStudy: '', academicLevel: '', teamId: '' },
  });
  const isIntern = useWatch({ control, name: 'role' }) === Role.INTERN;

  async function submit(values) {
    setSubmitError('');
    // Only send intern fields for an intern (and drop empty optional ones).
    const payload = { ...values };
    INTERN_FIELDS.forEach((field) => {
      if (!isIntern || !payload[field]) delete payload[field];
    });
    try {
      await onSubmit(payload);
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
          <option value={Role.INTERN}>{t('admin.userForm.intern')}</option>
        </Select>
        {isIntern && (
          <fieldset className="flex flex-col gap-4 rounded-md border border-border p-4">
            <legend className="px-1 text-sm font-medium text-foreground">{t('admin.userForm.internDetails')}</legend>
            <div className="grid grid-cols-2 gap-4">
              <Input id="user-studentId" label={t('common.field.studentId')} required error={errors.studentId?.message} {...register('studentId')} />
              <Input id="user-university" label={t('common.field.university')} required error={errors.university?.message} {...register('university')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input id="user-fieldOfStudy" label={t('common.field.fieldOfStudy')} {...register('fieldOfStudy')} />
              <Input id="user-academicLevel" label={t('common.field.academicLevel')} {...register('academicLevel')} />
            </div>
            <Select id="user-team" label={t('admin.userForm.team')} {...register('teamId')}>
              <option value="">{t('admin.userForm.noTeam')}</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Select>
          </fieldset>
        )}
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
