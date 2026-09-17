import { z } from 'zod';

/**
 * One schema for the whole wizard, grouped by step so each step can be
 * validated independently with react-hook-form's `trigger(fieldsForStep)`
 * before advancing. Wrapped in `.refine` (rather than plain `.object`) so
 * we can cross-check password === confirmPassword.
 *
 * Built as a factory taking `t` so validation messages follow the current
 * language — call it inside the component (memoized on `t`), never at
 * module scope, since the language can change after the schema exists.
 */
export function makeApplicationSchema(t) {
  return z
    .object({
      // Step 1 — Personal Information
      firstName: z.string().min(1, t('apply.errors.firstNameRequired')),
      lastName: z.string().min(1, t('apply.errors.lastNameRequired')),
      personalId: z.string().min(1, t('apply.errors.personalIdRequired')),
      email: z.string().min(1, t('apply.errors.emailRequired')).email(t('apply.errors.emailInvalid')),
      phone: z.string().min(10, t('apply.errors.phoneInvalid')),
      birthday: z.string().min(1, t('apply.errors.birthdayRequired')),
      // This becomes the intern's login password once the application is
      // accepted (see applicationsApi.decideApplication) — set here rather
      // than emailed later, so the applicant picks it themselves up front.
      password: z.string().min(8, t('apply.errors.passwordMin')),
      confirmPassword: z.string().min(1, t('apply.errors.confirmPasswordRequired')),

      // Step 2 — Education
      university: z.string().min(1, t('apply.errors.universityRequired')),
      major: z.string().min(1, t('apply.errors.majorRequired')),
      grade: z.string().min(1, t('apply.errors.gradeRequired')),
      teamPreference: z.string().min(1, t('apply.errors.teamRequired')),
      startDate: z.string().min(1, t('apply.errors.startDateRequired')),
      endDate: z.string().min(1, t('apply.errors.endDateRequired')),

      // Step 3 — Uploads
      cvFile: z.any().refine((file) => !!file, t('apply.errors.cvRequired')),
      photoFile: z.any().refine((file) => !!file, t('apply.errors.photoRequired')),
      agreementFile: z.any().refine((file) => !!file, t('apply.errors.agreementRequired')),
      internshipRequestFile: z.any().refine((file) => !!file, t('apply.errors.internshipRequestRequired')),
      // Extra documents beyond the required four (motivation letter, a
      // recommendation, ...) — each needs a label saying what it is, but the
      // list itself is optional and can stay empty.
      otherDocuments: z
        .array(
          z.object({
            label: z.string().min(1, t('apply.errors.documentNameRequired')),
            file: z.any().refine((file) => !!file, t('apply.errors.fileRequired')),
          })
        )
        .optional()
        .default([]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('apply.errors.passwordsDontMatch'),
    });
}

export const STEP_FIELDS = [
  ['firstName', 'lastName', 'personalId', 'email', 'phone', 'birthday', 'password', 'confirmPassword'],
  ['university', 'major', 'grade', 'teamPreference', 'startDate', 'endDate'],
  ['cvFile', 'photoFile', 'agreementFile', 'internshipRequestFile', 'otherDocuments'],
];

export function makeSteps(t) {
  return [
    { key: 'personal', label: t('apply.steps.personal') },
    { key: 'education', label: t('apply.steps.education') },
    { key: 'uploads', label: t('apply.steps.uploads') },
  ];
}
