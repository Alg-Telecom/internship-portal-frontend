import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
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
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  async function handleSavePhoto(profilePhotoUrl) {
    await usersApi.updateUser(user.id, { profilePhotoUrl });
    refreshUser({ profilePhotoUrl });
    showToast(t('settings.photoUpdated'));
  }

  async function handleSaveName({ firstName, lastName }) {
    await usersApi.updateUser(user.id, { firstName, lastName });
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
    </div>
  );
}
