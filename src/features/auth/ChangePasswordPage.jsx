import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import ChangePasswordForm from './components/ChangePasswordForm';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as authApi from '../../services/mockApi/authApi';

export default function ChangePasswordPage() {
  usePageHeader('Change Password');
  const { user } = useAuth();
  const { showToast } = useToast();

  async function handleSubmit({ currentPassword, newPassword }) {
    await authApi.changePassword(user.id, { currentPassword, newPassword });
    showToast('Your password has been updated.');
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <ChangePasswordForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
