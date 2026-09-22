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
import * as usersApi from '../../services/api/usersApi';
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
    try {
      const created = await usersApi.createUser(values);
      if (created.temporaryPassword) {
        // No password field in this form - the backend generated one (and
        // tried to email it). Show it once here too, since SMTP may not be
        // configured yet (see backend/docs/SETUP.md) and this is the only
        // chance to see/copy it - it's never returned again after this.
        showToast(t('admin.users.createdWithPassword', { password: created.temporaryPassword }), { duration: 0 });
      } else {
        showToast(t('admin.users.created'));
      }
      refetch();
    } catch (err) {
      showToast(err.message, { type: 'error' });
    }
  }

  async function handleDeactivate(targetUser) {
    try {
      // Real backend has no standalone "deactivate" endpoint — it's just a
      // regular PATCH /users/:id with isActive: false.
      await usersApi.updateUser(targetUser.id, { isActive: false });
      showToast(t('admin.users.deactivated', { name: fullName(targetUser) }), { type: 'info' });
      refetch();
    } catch (err) {
      showToast(err.message, { type: 'error' });
    }
  }

  async function handleActivate(targetUser) {
    try {
      await usersApi.updateUser(targetUser.id, { isActive: true });
      showToast(t('admin.users.reactivated', { name: fullName(targetUser) }));
      refetch();
    } catch (err) {
      showToast(err.message, { type: 'error' });
    }
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await usersApi.deleteUser(deletingUser.id);
      showToast(t('admin.users.deleted', { name: fullName(deletingUser) }), { type: 'info' });
      setDeletingUser(null);
      refetch();
    } catch (err) {
      // Most common case: the backend refuses to hard-delete a user who
      // still has related records (assignments, submissions, attendance,
      // documents, ...) and returns a 409 with an explanation — surface
      // that instead of letting it fail silently. Leave the confirm
      // dialog open so the message stays visible next to it.
      showToast(err.message, { type: 'error', duration: 6000 });
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
