import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useTeams } from '../../hooks/useTeams';
import ProfileSummaryCard from './components/ProfileSummaryCard';

export default function ProfilePage() {
  usePageHeader('My Profile');
  const { user } = useAuth();
  const { teams } = useTeams();
  const team = teams.find((t) => t.id === user.teamId);

  return <ProfileSummaryCard intern={user} team={team} />;
}
