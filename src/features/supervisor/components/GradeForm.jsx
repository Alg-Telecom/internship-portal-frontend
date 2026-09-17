import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    grade: z
      .string()
      .min(1, t('supervisor.assignments.gradeRequired'))
      .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 20, t('supervisor.assignments.gradeRange')),
    feedback: z.string().min(1, t('supervisor.assignments.feedbackRequired')),
  });
}

export default function GradeForm({ submission, onSubmit }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { grade: submission.grade ?? '', feedback: submission.feedback ?? '' } });

  const isGraded = submission.status === 'Accepted';

  return (
    <form onSubmit={handleSubmit((values) => onSubmit({ grade: Number(values.grade), feedback: values.feedback }))} noValidate className="flex flex-col gap-4">
      <Input id="grade" label={t('supervisor.assignments.gradeLabel')} required disabled={isGraded} error={errors.grade?.message} {...register('grade')} />
      <Textarea id="feedback" label={t('supervisor.assignments.feedback')} required disabled={isGraded} error={errors.feedback?.message} {...register('feedback')} />
      {!isGraded && (
        <Button type="submit" isLoading={isSubmitting} className="self-start">
          {t('supervisor.assignments.submitGrade')}
        </Button>
      )}
    </form>
  );
}
