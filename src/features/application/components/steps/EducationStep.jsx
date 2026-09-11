import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import DateRangePicker from '../../../../components/ui/DateRangePicker';
import { useTeams } from '../../../../hooks/useTeams';

const GRADE_OPTIONS = ["Bachelor's", "Master's", 'Engineering', 'PhD'];

export default function EducationStep({ register, errors, watch, setValue }) {
  const { teams } = useTeams();
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input id="university" label="University" required error={errors.university?.message} {...register('university')} />
      <Input id="major" label="Major" required error={errors.major?.message} {...register('major')} />
      <Select id="grade" label="Grade" required placeholder="Select your academic level" error={errors.grade?.message} {...register('grade')}>
        {GRADE_OPTIONS.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </Select>
      <Select id="teamPreference" label="Team" required placeholder="Select a preferred team" error={errors.teamPreference?.message} {...register('teamPreference')}>
        {teams.map((team) => (
          <option key={team.id} value={team.name}>
            {team.name}
          </option>
        ))}
        <option value="No preference">No preference</option>
      </Select>
      <DateRangePicker
        id="startDate"
        label="Internship Date"
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
