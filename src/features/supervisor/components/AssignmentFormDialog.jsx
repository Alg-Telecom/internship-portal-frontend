import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '../../../components/ui/Dialog';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import DatePicker from '../../../components/ui/DatePicker';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { useInterns } from '../../../hooks/useUsers';
import { useTeams } from '../../../hooks/useTeams';
import { AssignmentPriority } from '../../../domain/enums';
import { fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

function makeSchema(t) {
  return z.object({
    internId: z.string().min(1, t('supervisor.assignments.internRequired')),
    title: z.string().min(1, t('supervisor.assignments.titleRequired')),
    description: z.string().min(1, t('supervisor.assignments.descriptionRequired')),
    priority: z.string().min(1, t('supervisor.assignments.priorityRequired')),
    deadline: z.string().min(1, t('supervisor.assignments.deadlineRequired')),
  });
}

/**
 * Create AND edit share this one dialog, same pattern as TeamFormDialog —
 * pass `assignment` to edit it (fields pre-filled, intern locked since
 * reassigning an existing assignment to someone else isn't supported),
 * omit it to create a new one.
 */
export default function AssignmentFormDialog({ open, onClose, onSubmit, assignment }) {
  const { t } = useLanguage();
  const schema = useMemo(() => makeSchema(t), [t]);
  const { user } = useAuth();
  const { teams } = useTeams();
  const myTeamIds = teams.filter((t) => t.supervisorId === user.id).map((t) => t.id);
  const { interns } = useInterns();
  const myInterns = interns.filter((i) => myTeamIds.includes(i.teamId));

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { internId: '', title: '', description: '', priority: AssignmentPriority.MEDIUM, deadline: '' } });

  useEffect(() => {
    if (open) {
      reset({
        internId: assignment ? String(assignment.internId) : '',
        title: assignment?.title || '',
        description: assignment?.description || '',
        priority: assignment?.priority || AssignmentPriority.MEDIUM,
        deadline: assignment?.deadline || '',
      });
    }
  }, [open, assignment, reset]);

  const deadline = watch('deadline');
  const assignedIntern = assignment ? myInterns.find((i) => i.id === assignment.internId) : null;

  async function submit(values) {
    if (assignment) {
      await onSubmit({ title: values.title, description: values.description, priority: values.priority, deadline: values.deadline });
    } else {
      const intern = myInterns.find((i) => i.id === Number(values.internId));
      await onSubmit({ ...values, internId: Number(values.internId), teamId: intern?.teamId, supervisorId: user.id });
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title={assignment ? t('supervisor.assignments.editTitle') : t('supervisor.assignments.newTitle')}>
      <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col gap-4">
        {assignment ? (
          <Input id="assignment-intern-readonly" label={t('supervisor.assignments.intern')} value={assignedIntern ? fullName(assignedIntern) : ''} disabled readOnly />
        ) : (
          <Select id="assignment-intern" label={t('supervisor.assignments.intern')} required placeholder={t('supervisor.assignments.selectIntern')} error={errors.internId?.message} {...register('internId')}>
            {myInterns.map((intern) => (
              <option key={intern.id} value={intern.id}>
                {fullName(intern)}
              </option>
            ))}
          </Select>
        )}
        <Input id="assignment-title" label={t('supervisor.assignments.titleField')} required error={errors.title?.message} {...register('title')} />
        <Textarea id="assignment-description" label={t('supervisor.assignments.description')} required error={errors.description?.message} {...register('description')} />
        <div className="grid grid-cols-2 gap-4">
          <Select id="assignment-priority" label={t('supervisor.assignments.priority')} required error={errors.priority?.message} {...register('priority')}>
            {Object.values(AssignmentPriority).map((value) => (
              <option key={value} value={value}>
                {t(`common.priority.${value}`)}
              </option>
            ))}
          </Select>
          <DatePicker id="assignment-deadline" label={t('supervisor.assignments.deadline')} required value={deadline} onChange={(v) => setValue('deadline', v, { shouldValidate: true })} error={errors.deadline?.message} />
        </div>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {assignment ? t('supervisor.assignments.saveChanges') : t('supervisor.assignments.createAssignment')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
