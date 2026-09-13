import { Prohibit, CheckCircle, TrashSimple } from '@phosphor-icons/react';
import DataTable from '../../../components/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import { fullName } from '../../../lib/utils';

const ROLE_TONE = { admin: 'primary', supervisor: 'accent', intern: 'info' };

export default function UsersTable({ users, isLoading, currentUserId, onDeactivate, onActivate, onDelete }) {
  const columns = [
    {
      key: 'name',
      header: 'User',
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
    { key: 'role', header: 'Role', render: (row) => <Badge tone={ROLE_TONE[row.role]}>{row.role}</Badge> },
    { key: 'phoneNumber', header: 'Phone', render: (row) => row.phoneNumber || '—' },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.isActive ? 'success' : 'muted'}>{row.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => {
        // Never let an admin deactivate or delete their own account —
        // that would lock them out with no other way back in.
        if (row.id === currentUserId) {
          return <span className="text-xs text-muted-foreground">(you)</span>;
        }
        return (
          <div className="flex justify-end gap-3">
            {row.isActive ? (
              <button
                type="button"
                onClick={() => onDeactivate(row)}
                aria-label={`Deactivate ${fullName(row)}`}
                title="Deactivate"
                className="cursor-pointer text-muted-foreground hover:text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <Prohibit className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onActivate(row)}
                aria-label={`Activate ${fullName(row)}`}
                title="Activate"
                className="cursor-pointer text-muted-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(row)}
              aria-label={`Delete ${fullName(row)}`}
              title="Delete"
              className="cursor-pointer text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <TrashSimple className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} rows={users} isLoading={isLoading} emptyTitle="No users found" />;
}
