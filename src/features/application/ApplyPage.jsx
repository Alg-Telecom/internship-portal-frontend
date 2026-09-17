import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import logo from '../../assets/algerie-telecom-logo.png';
import ApplyWizardStepper from './components/ApplyWizardStepper';
import WizardNavButtons from './components/WizardNavButtons';
import PersonalInfoStep from './components/steps/PersonalInfoStep';
import EducationStep from './components/steps/EducationStep';
import UploadsStep from './components/steps/UploadsStep';
import { makeApplicationSchema, STEP_FIELDS } from './schema';
import * as applicationsApi from '../../services/mockApi/applicationsApi';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/layout/LanguageSwitcher';

export default function ApplyPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const applicationSchema = useMemo(() => makeApplicationSchema(t), [t]);

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      personalId: '',
      email: '',
      phone: '',
      birthday: '',
      password: '',
      confirmPassword: '',
      university: '',
      major: '',
      grade: '',
      teamPreference: '',
      startDate: '',
      endDate: '',
      cvFile: null,
      photoFile: null,
      agreementFile: null,
      internshipRequestFile: null,
      otherDocuments: [],
    },
  });

  const { register, control, handleSubmit, watch, setValue, trigger, getValues, setError, formState } = form;
  const { errors, isSubmitting } = formState;
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[stepIndex]);
    if (!valid) return;

    // Catch "you already have an account" right after personal info (step 1)
    // instead of only at final submit, after education details and file
    // uploads have already been filled in for nothing.
    if (stepIndex === 0) {
      setIsCheckingEmail(true);
      try {
        const exists = await applicationsApi.checkEmailExists(getValues('email'));
        if (exists) {
          setError('email', { type: 'manual', message: t('apply.errors.emailAlreadyExists') });
          return;
        }
      } catch {
        // If the check itself fails (e.g. a network hiccup), don't block
        // the applicant here - submitApplication() still enforces this
        // server-side as the source of truth.
      } finally {
        setIsCheckingEmail(false);
      }
    }

    setStepIndex((i) => Math.min(i + 1, STEP_FIELDS.length - 1));
  }

  function goPrevious() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function onFormSubmit(values) {
    setSubmitError('');
    try {
      await applicationsApi.submitApplication({
        firstName: values.firstName,
        lastName: values.lastName,
        personalId: values.personalId,
        email: values.email,
        phone: values.phone,
        birthday: values.birthday,
        password: values.password,
        university: values.university,
        major: values.major,
        grade: values.grade,
        teamPreference: values.teamPreference,
        startDate: values.startDate,
        endDate: values.endDate,
        cvFile: values.cvFile,
        photoFile: values.photoFile,
        agreementFile: values.agreementFile,
        internshipRequestFile: values.internshipRequestFile,
        otherDocuments: values.otherDocuments || [],
      });
      navigate('/apply/success', { replace: true });
    } catch (error) {
      setSubmitError(error.message || t('apply.errors.submitFailed'));
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (stepIndex < STEP_FIELDS.length - 1) {
      goNext();
      return;
    }
    handleSubmit(onFormSubmit)(event);
  }

  const stepProps = { register, errors, control, watch, setValue };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-primary">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Algerie Telecom" className="h-9 w-9 rounded bg-white object-contain p-1" />
            <h1 className="text-lg font-semibold text-white">{t('apply.headerTitle')}</h1>
          </div>
          <LanguageSwitcher variant="onDark" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <ApplyWizardStepper currentIndex={stepIndex} />

          <form onSubmit={handleFormSubmit} noValidate className="mt-8">
            {submitError && (
              <p role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                {submitError}
              </p>
            )}
            {stepIndex === 0 && <PersonalInfoStep {...stepProps} />}
            {stepIndex === 1 && <EducationStep {...stepProps} />}
            {stepIndex === 2 && <UploadsStep {...stepProps} />}

            <WizardNavButtons stepIndex={stepIndex} totalSteps={STEP_FIELDS.length} onPrevious={goPrevious} isSubmitting={isSubmitting || isCheckingEmail} />
          </form>
        </div>
      </main>
    </div>
  );
}
