import { useParams, Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useUsers } from '../../hooks/useUsers';
import { useTeams } from '../../hooks/useTeams';
import { SkeletonRows } from '../../components/ui/Skeleton';
import Tabs from '../../components/ui/Tabs';
import InternProfileCard from './components/InternProfileCard';
import InternAssignmentsTab from './components/InternAssignmentsTab';
import InternAttendanceTab from './components/InternAttendanceTab';
import InternGradesTab from './components/InternGradesTab';
import { useLanguage } from '../../context/LanguageContext';

export default function InternDetailPage() {
  const { t } = useLanguage();
  usePageHeader(t('common.field.internDetails'));
  const { id } = useParams();
  const { users } = useUsers();
  const { teams } = useTeams();

  const intern = users.find((u) => u.id === Number(id));
  const team = intern ? teams.find((t) => t.id === intern.teamId) : null;

  if (!intern) {
    return <SkeletonRows rows={6} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Link to="/admin/interns" className="flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <CaretLeft className="h-4 w-4" aria-hidden="true" />
        {t('common.field.backToInterns')}
      </Link>
      <InternProfileCard intern={intern} team={team} />
      <Tabs
        tabs={[
          { key: 'assignments', label: t('common.tabs.assignments'), content: <InternAssignmentsTab internId={intern.id} /> },
          { key: 'attendance', label: t('common.tabs.attendance'), content: <InternAttendanceTab internId={intern.id} /> },
          { key: 'grades', label: t('common.tabs.grades'), content: <InternGradesTab internId={intern.id} /> },
        ]}
      />
    </div>
  );
}
