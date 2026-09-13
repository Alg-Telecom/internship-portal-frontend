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

export default function UsersPage() {
  usePageHeader('Users');
  const { user: currentUser } = useAuth();
  const { users, isLoading, refetch } = useUsers();
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(values) {
    await usersApi.createUser(values);
    showToast('User created. A temporary password was generated.');
    refetch();
  }

  async function handleDeactivate(targetUser) {
    await usersApi.deactivateUser(targetUser.id);
    showToast(`${targetUser.firstName} ${targetUser.lastName} has been deactivated.`, { type: 'info' });
    refetch();
  }

  async function handleActivate(targetUser) {
    await usersApi.updateUser(targetUser.id, { isActive: true });
    showToast(`${targetUser.firstName} ${targetUser.lastName} has been reactivated.`);
    refetch();
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await usersApi.deleteUser(deletingUser.id);
      showToast(`${deletingUser.firstName} ${deletingUser.lastName} has been deleted.`, { type: 'info' });
      setDeletingUser(null);
      refetch();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <Button size="sm" onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New user
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
        title="Delete user"
        description={deletingUser ? `This permanently deletes ${deletingUser.firstName} ${deletingUser.lastName}'s account. This cannot be undone.` : ''}
        confirmLabel="Delete user"
      />
    </Card>
  );
}
