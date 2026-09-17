import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../context/LanguageContext';

export default function InternsFilterBar({ teamId, onTeamChange, teams }) {
  const { t, tTeam } = useLanguage();
  return (
    <div className="border-b border-border p-4">
      <Select id="team-filter" value={teamId} onChange={(e) => onTeamChange(e.target.value)} className="sm:w-64" aria-label={t('admin.interns.filterAriaLabel')}>
        <option value="">{t('admin.interns.allTeams')}</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {tTeam(team)}
          </option>
        ))}
      </Select>
    </div>
  );
}
