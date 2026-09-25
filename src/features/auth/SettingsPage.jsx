import { useState } from 'react';
import { SignOut } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import ProfilePhotoField from './components/ProfilePhotoField';
import ProfileNameForm from './components/ProfileNameForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import { usePageHeader } from '../../context/PageTitleContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import * as authApi from '../../services/api/authApi';
import { useUpdateOwnProfile, useUploadOwnPhoto, useDeactivateOwnAccount } from '../../hooks/useUsers';

export default function SettingsPage() {
  const { t } = useLanguage();
  usePageHeader(t('topbar.settings'));
  const { user, refreshUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const updateOwnProfile = useUpdateOwnProfile();
  const uploadOwnPhoto = useUploadOwnPhoto();
  const deactivateOwnAccount = useDeactivateOwnAccount();
  const [isCancellingInternship, setIsCancellingInternship] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  // Self-withdrawal: deactivates the account server-side (same effect as
  // an admin deactivating it), then clears local session state the same
  // way the logout button does, so the intern lands back on /login.
  async function handleCancelInternship() {
    await deactivateOwnAccount.mutateAsync();
    await logout();
    navigate('/login', { replace: true });
  }

  async function handleSavePhoto(file) {
    const updated = await uploadOwnPhoto.mutateAsync(file);
    refreshUser({ profilePhotoUrl: updated.profilePhotoUrl });
    showToast(t('settings.photoUpdated'));
  }

  async function handleSaveName({ firstName, lastName }) {
    await updateOwnProfile.mutateAsync({ firstName, lastName });
    refreshUser({ firstName, lastName });
    showToast(t('settings.nameUpdated'));
  }

  async function handleChangePassword({ currentPassword, newPassword }) {
    await authApi.changePassword(currentPassword, newPassword);
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

      {user.role === 'intern' && (
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.cancelInternship.title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">{t('settings.cancelInternship.description')}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-white text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => setIsCancellingInternship(true)}
            >
              {t('settings.cancelInternship.button')}
            </Button>
          </CardContent>
        </Card>
      )}

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

      <ConfirmDialog
        open={isCancellingInternship}
        onClose={() => setIsCancellingInternship(false)}
        onConfirm={handleCancelInternship}
        title={t('settings.cancelInternship.confirmTitle')}
        description={t('settings.cancelInternship.confirmDescription')}
        confirmLabel={t('settings.cancelInternship.confirmButton')}
        isLoading={deactivateOwnAccount.isPending}
      />
    </div>
  );
}
