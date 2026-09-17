import { useNavigate } from 'react-router-dom';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useTeams } from '../../hooks/useTeams';
import { useAssignments } from '../../hooks/useAssignments';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import AssignmentCalendar from '../../components/shared/AssignmentCalendar';
import ProfileSummaryCard from './components/ProfileSummaryCard';
import { useLanguage } from '../../context/LanguageContext';

export default function ProfilePage() {
  const { t } = useLanguage();
  usePageHeader(t('intern.profile.title'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teams } = useTeams();
  const { assignments } = useAssignments({ internId: user.id });
  const team = teams.find((t) => t.id === user.teamId);

  return (
    <div className="flex flex-col gap-6">
      <ProfileSummaryCard intern={user} team={team} />
      <Card>
        <CardHeader>
          <CardTitle>{t('common.deadlines')}</CardTitle>
        </CardHeader>
        <div className="px-5 py-4">
          <AssignmentCalendar assignments={assignments} onSelectAssignment={(a) => navigate(`/intern/assignments/${a.id}`)} />
        </div>
      </Card>
    </div>
  );
}
