import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';

const schema = z.object({
  grade: z
    .string()
    .min(1, 'Grade is required.')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 20, 'Enter a grade between 0 and 20.'),
  feedback: z.string().min(1, 'Please provide feedback for the intern.'),
});

export default function GradeForm({ submission, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { grade: submission.grade ?? '', feedback: submission.feedback ?? '' } });

  const isGraded = submission.status === 'Accepted';

  return (
    <form onSubmit={handleSubmit((values) => onSubmit({ grade: Number(values.grade), feedback: values.feedback }))} noValidate className="flex flex-col gap-4">
      <Input id="grade" label="Grade (out of 20)" required disabled={isGraded} error={errors.grade?.message} {...register('grade')} />
      <Textarea id="feedback" label="Feedback" required disabled={isGraded} error={errors.feedback?.message} {...register('feedback')} />
      {!isGraded && (
        <Button type="submit" isLoading={isSubmitting} className="self-start">
          Submit grade
        </Button>
      )}
    </form>
  );
}
