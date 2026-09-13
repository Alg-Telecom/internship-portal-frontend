import { useNavigate } from 'react-router-dom';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useAssignments } from '../../hooks/useAssignments';
import Card from '../../components/ui/Card';
import InternAssignmentsList from './components/InternAssignmentsList';

export default function AssignmentsPage() {
  usePageHeader('My Assignments');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignments, isLoading } = useAssignments({ internId: user.id });

  return (
    <Card className="p-4">
      <InternAssignmentsList assignments={assignments} isLoading={isLoading} onSelect={(a) => navigate(`/intern/assignments/${a.id}`)} />
    </Card>
  );
}
