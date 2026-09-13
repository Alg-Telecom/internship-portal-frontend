import Select from '../../../components/ui/Select';

export default function InternsFilterBar({ teamId, onTeamChange, teams }) {
  return (
    <div className="border-b border-border p-4">
      <Select id="team-filter" value={teamId} onChange={(e) => onTeamChange(e.target.value)} className="sm:w-64" aria-label="Filter by team">
        <option value="">All teams</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
