import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';
import { useTeams } from '../../../../hooks/useTeams';
import { useLanguage } from '../../../../context/LanguageContext';

const GRADE_OPTIONS = ["Bachelor's", "Master's", 'Engineering', 'PhD'];

export default function EducationStep({ register, errors, watch, setValue }) {
  const { t, tTeam } = useLanguage();
  const { teams } = useTeams();
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input id="university" label={t('apply.education.university')} required error={errors.university?.message} {...register('university')} />
      <Input id="major" label={t('apply.education.major')} required error={errors.major?.message} {...register('major')} />
      <Select id="grade" label={t('apply.education.grade')} required placeholder={t('apply.education.gradeSelectPlaceholder')} error={errors.grade?.message} {...register('grade')}>
        {GRADE_OPTIONS.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </Select>
      <Select id="teamPreference" label={t('apply.education.team')} required placeholder={t('apply.education.teamSelectPlaceholder')} error={errors.teamPreference?.message} {...register('teamPreference')}>
        {teams.map((team) => (
          <option key={team.id} value={team.name}>
            {tTeam(team)}
          </option>
        ))}
        <option value="No preference">{t('apply.education.noPreference')}</option>
      </Select>
      <DateRangePicker
        id="startDate"
        label={t('apply.education.internshipDate')}
        required
        startValue={startDate}
        endValue={endDate}
        error={errors.startDate?.message || errors.endDate?.message}
        onChange={({ startDate: s, endDate: e }) => {
          setValue('startDate', s, { shouldValidate: true });
          setValue('endDate', e, { shouldValidate: true });
        }}
      />
    </div>
  );
}
