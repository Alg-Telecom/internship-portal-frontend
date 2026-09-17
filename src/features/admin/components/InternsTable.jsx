import DataTable from '../../../components/shared/DataTable';
import Avatar from '../../../components/ui/Avatar';
import { fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function InternsTable({ interns, teamsById, isLoading, onSelect }) {
  const { t, tTeam } = useLanguage();
  const columns = [
    {
      key: 'name',
      header: t('admin.interns.intern'),
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
    { key: 'university', header: t('admin.interns.university'), render: (row) => row.university },
    { key: 'fieldOfStudy', header: t('admin.interns.fieldOfStudy'), render: (row) => row.fieldOfStudy },
    { key: 'team', header: t('admin.interns.team'), render: (row) => (row.teamId ? tTeam(teamsById[row.teamId]) : '—') },
  ];

  return (
    <DataTable
      columns={columns}
      rows={interns}
      isLoading={isLoading}
      emptyTitle={t('admin.interns.noneFound')}
      emptyDescription={t('admin.interns.noneFoundDescription')}
      onRowClick={onSelect}
    />
  );
}
