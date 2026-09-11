import { z } from 'zod';

/**
 * One schema for the whole wizard, grouped by step so each step can be
 * validated independently with react-hook-form's `trigger(fieldsForStep)`
 * before advancing. Wrapped in `.refine` (rather than plain `.object`) so
 * we can cross-check password === confirmPassword.
 */
export const applicationSchema = z
  .object({
    // Step 1 — Personal Information
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
    personalId: z.string().min(1, 'Personal ID is required.'),
    email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),
    phone: z.string().min(6, 'Enter a valid phone number.'),
    birthday: z.string().min(1, 'Birthday is required.'),
    // This becomes the intern's login password once the application is
    // accepted (see applicationsApi.decideApplication) — set here rather
    // than emailed later, so the applicant picks it themselves up front.
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),

    // Step 2 — Education
    university: z.string().min(1, 'University is required.'),
    major: z.string().min(1, 'Major is required.'),
    grade: z.string().min(1, 'Please select your academic level.'),
    teamPreference: z.string().min(1, 'Please select a preferred team.'),
    startDate: z.string().min(1, 'Start date is required.'),
    endDate: z.string().min(1, 'End date is required.'),

    // Step 3 — Uploads
    cvFile: z.any().refine((file) => !!file, 'Please attach your CV.'),
    photoFile: z.any().refine((file) => !!file, 'Please attach a personal photograph.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export const STEP_FIELDS = [
  ['firstName', 'lastName', 'personalId', 'email', 'phone', 'birthday', 'password', 'confirmPassword'],
  ['university', 'major', 'grade', 'teamPreference', 'startDate', 'endDate'],
  ['cvFile', 'photoFile'],
];

export const STEPS = [
  { key: 'personal', label: 'Personal Information' },
  { key: 'education', label: 'Education' },
  { key: 'uploads', label: 'Uploads' },
];
