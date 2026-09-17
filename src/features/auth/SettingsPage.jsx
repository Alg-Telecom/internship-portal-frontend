import { SignOut } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProfilePhotoField from './components/ProfilePhotoField';
import ProfileNameForm from './components/ProfileNameForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import * as authApi from '../../services/mockApi/authApi';
import * as usersApi from '../../services/mockApi/usersApi';

export default function SettingsPage() {
  const { t } = useLanguage();
  usePageHeader(t('topbar.settings'));
  const { user, refreshUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  async function handleSavePhoto(file) {
    const updated = await usersApi.uploadOwnPhoto(file);
    refreshUser({ profilePhotoUrl: updated.profilePhotoUrl });
    showToast(t('settings.photoUpdated'));
  }

  async function handleSaveName({ firstName, lastName }) {
    await usersApi.updateOwnProfile({ firstName, lastName });
    refreshUser({ firstName, lastName });
    showToast(t('settings.nameUpdated'));
  }

  async function handleChangePassword({ currentPassword, newPassword }) {
    await authApi.changePassword(user.id, { currentPassword, newPassword });
    showToast(t('settings.passwordUpdated'));
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.profilePhoto')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfilePhotoField user={user} onSave={handleSavePhoto} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.name')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileNameForm user={user} onSubmit={handleSaveName} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.password')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm onSubmit={handleChangePassword} />
        </CardContent>
      </Card>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="self-start bg-white text-destructive hover:bg-destructive/5 hover:text-destructive"
        onClick={handleLogout}
      >
        <SignOut className="h-4 w-4" aria-hidden="true" />
        {t('topbar.logout')}
      </Button>
    </div>
  );
}
