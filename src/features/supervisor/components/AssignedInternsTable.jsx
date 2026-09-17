import DataTable from '../../../components/shared/DataTable';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import { fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

const OPEN_STATUSES = ['Pending', 'InProgress', 'Late'];

export default function AssignedInternsTable({ interns, isLoading, assignmentsByIntern = {}, onSelect }) {
  const { t } = useLanguage();
  const columns = [
    {
      key: 'name',
      header: t('supervisor.team.intern'),
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar firstName={row.firstName} lastName={row.lastName} photoUrl={row.profilePhotoUrl} size="sm" />
          <div>
            <p className="font-medium text-foreground">{fullName(row)}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'university', header: t('supervisor.team.university'), render: (row) => row.university },
    { key: 'fieldOfStudy', header: t('supervisor.team.fieldOfStudy'), render: (row) => row.fieldOfStudy },
    {
      key: 'assignments',
      header: t('supervisor.team.assignments'),
      render: (row) => {
        const items = assignmentsByIntern[row.id] || [];
        if (items.length === 0) return <span className="text-muted-foreground">—</span>;
        const openCount = items.filter((a) => OPEN_STATUSES.includes(a.status)).length;
        return (
          <div className="flex items-center gap-2">
            <span className="text-foreground">
              {t('supervisor.team.assignmentCount', { count: items.length, plural: items.length > 1 ? 's' : '' })}
            </span>
            {openCount > 0 && <Badge tone="warning">{t('supervisor.team.openCount', { count: openCount })}</Badge>}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={interns}
      isLoading={isLoading}
      emptyTitle={t('supervisor.team.noInternsAssigned')}
      onRowClick={onSelect}
    />
  );
}
