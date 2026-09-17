import { useNavigate } from 'react-router-dom';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../hooks/useAssignments';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import AssignmentCalendar from '../../components/shared/AssignmentCalendar';
import InternAssignmentsList from './components/InternAssignmentsList';
import { useLanguage } from '../../context/LanguageContext';

export default function AssignmentsPage() {
  const { t } = useLanguage();
  usePageHeader(t('intern.assignments.title'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignments, isLoading } = useAssignments({ internId: user.id });

  function goToAssignment(a) {
    navigate(`/intern/assignments/${a.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('common.deadlines')}</CardTitle>
        </CardHeader>
        <div className="px-5 py-4">
          <AssignmentCalendar assignments={assignments} onSelectAssignment={goToAssignment} />
        </div>
      </Card>

      <Card className="p-4">
        <InternAssignmentsList assignments={assignments} isLoading={isLoading} onSelect={goToAssignment} />
      </Card>
    </div>
  );
}
