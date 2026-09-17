import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageHeader } from '../../context/PageTitleContext';
import { useInterns } from '../../hooks/useUsers';
import { useTeams } from '../../hooks/useTeams';
import Card from '../../components/ui/Card';
import InternsFilterBar from './components/InternsFilterBar';
import InternsTable from './components/InternsTable';
import { useLanguage } from '../../context/LanguageContext';

export default function InternsListPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.interns.title'));
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState('');
  const { interns, isLoading } = useInterns({ teamId });
  const { teams } = useTeams();
  const teamsById = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <Card>
      <InternsFilterBar teamId={teamId} onTeamChange={setTeamId} teams={teams} />
      <InternsTable interns={interns} teamsById={teamsById} isLoading={isLoading} onSelect={(intern) => navigate(`/admin/interns/${intern.id}`)} />
    </Card>
  );
}
