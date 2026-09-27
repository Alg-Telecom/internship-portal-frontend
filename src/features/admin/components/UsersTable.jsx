import { Prohibit, CheckCircle, TrashSimple } from '@phosphor-icons/react';
import DataTable from '../../../components/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import Avatar from '../../../components/ui/Avatar';
import { fullName } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

const ROLE_TONE = { admin: 'primary', supervisor: 'accent', intern: 'info' };

export default function UsersTable({ users, isLoading, currentUserId, onDeactivate, onActivate, onDelete }) {
  const { t } = useLanguage();
  const columns = [
    {
      key: 'name',
      header: t('admin.users.user'),
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
    { key: 'role', header: t('admin.users.role'), render: (row) => <Badge tone={ROLE_TONE[row.role]}>{t(`admin.users.role${row.role.charAt(0).toUpperCase()}${row.role.slice(1)}`)}</Badge> },
    { key: 'phoneNumber', header: t('admin.users.phone'), render: (row) => row.phoneNumber || '—' },
    {
      key: 'status',
      header: t('admin.users.status'),
      render: (row) => <Badge tone={row.isActive ? 'success' : 'muted'}>{row.isActive ? t('admin.users.active') : t('admin.users.inactive')}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (row) => {
        // Never let an admin deactivate or delete their own account —
        // that would lock them out with no other way back in.
        if (row.id === currentUserId) {
          return <span className="text-xs text-muted-foreground">{t('admin.users.you')}</span>;
        }
        return (
          <div className="flex justify-end gap-3">
            {row.isActive ? (
              <button
                type="button"
                onClick={() => onDeactivate(row)}
                aria-label={t('admin.users.deactivateAria', { name: fullName(row) })}
                title={t('admin.users.deactivate')}
                className="cursor-pointer text-muted-foreground hover:text-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <Prohibit className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onActivate(row)}
                aria-label={t('admin.users.activateAria', { name: fullName(row) })}
                title={t('admin.users.activate')}
                className="cursor-pointer text-muted-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            {/* Deleting is permanent: an account must be deactivated first
                (the backend enforces this too). */}
            <button
              type="button"
              onClick={() => onDelete(row)}
              disabled={row.isActive}
              aria-label={t('admin.users.deleteAria', { name: fullName(row) })}
              title={row.isActive ? t('admin.users.deactivateBeforeDelete') : t('admin.users.delete')}
              className="cursor-pointer text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted-foreground"
            >
              <TrashSimple className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} rows={users} isLoading={isLoading} emptyTitle={t('admin.users.noneFound')} />;
}
