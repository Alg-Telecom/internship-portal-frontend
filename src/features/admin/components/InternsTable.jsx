import DataTable from '../../../components/shared/DataTable';
import Avatar from '../../../components/ui/Avatar';
import { fullName } from '../../../lib/utils';

export default function InternsTable({ interns, teamsById, isLoading, onSelect }) {
  const columns = [
    {
      key: 'name',
      header: 'Intern',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar firstName={row.firstName} lastName={row.lastName} size="sm" />
          <div>
            <p className="font-medium text-foreground">{fullName(row)}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'university', header: 'University', render: (row) => row.university },
    { key: 'fieldOfStudy', header: 'Field of study', render: (row) => row.fieldOfStudy },
    { key: 'team', header: 'Team', render: (row) => (row.teamId ? teamsById[row.teamId]?.name : '—') },
  ];

  return (
    <DataTable
      columns={columns}
      rows={interns}
      isLoading={isLoading}
      emptyTitle="No interns found"
      emptyDescription="Accepted applicants will appear here once assigned to a team."
      onRowClick={onSelect}
    />
  );
}
