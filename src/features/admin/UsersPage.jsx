import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useUsers } from '../../hooks/useUsers';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import UsersTable from './components/UsersTable';
import UserFormDialog from './components/UserFormDialog';
import * as usersApi from '../../services/mockApi/usersApi';
import { useLanguage } from '../../context/LanguageContext';
import { fullName } from '../../lib/utils';

export default function UsersPage() {
  const { t } = useLanguage();
  usePageHeader(t('admin.users.title'));
  const { user: currentUser } = useAuth();
  const { users, isLoading, refetch } = useUsers();
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(values) {
    await usersApi.createUser(values);
    showToast(t('admin.users.created'));
    refetch();
  }

  async function handleDeactivate(targetUser) {
    await usersApi.deactivateUser(targetUser.id);
    showToast(t('admin.users.deactivated', { name: fullName(targetUser) }), { type: 'info' });
    refetch();
  }

  async function handleActivate(targetUser) {
    await usersApi.updateUser(targetUser.id, { isActive: true });
    showToast(t('admin.users.reactivated', { name: fullName(targetUser) }));
    refetch();
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await usersApi.deleteUser(deletingUser.id);
      showToast(t('admin.users.deleted', { name: fullName(deletingUser) }), { type: 'info' });
      setDeletingUser(null);
      refetch();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.users.title')}</CardTitle>
        <Button size="sm" onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('admin.users.newUser')}
        </Button>
      </CardHeader>
      <UsersTable
        users={users}
        isLoading={isLoading}
        currentUserId={currentUser.id}
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
        onDelete={setDeletingUser}
      />
      <UserFormDialog open={isCreating} onClose={() => setIsCreating(false)} onSubmit={handleCreate} />

      <ConfirmDialog
        open={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title={t('admin.users.deleteTitle')}
        description={deletingUser ? t('admin.users.deleteDescription', { name: fullName(deletingUser) }) : ''}
        confirmLabel={t('admin.users.deleteConfirmLabel')}
      />
    </Card>
  );
}
