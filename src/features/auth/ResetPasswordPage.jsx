import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { WarningCircle } from '@phosphor-icons/react';
import AuthLayout from './AuthLayout';
import ResetPasswordForm from './components/ResetPasswordForm';
import * as authApi from '../../services/api/authApi';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit({ newPassword }) {
    await authApi.resetPassword(token, newPassword);
    showToast(t('login.resetPassword.success'));
    navigate('/login', { replace: true });
  }

  if (!token) {
    return (
      <AuthLayout title={t('login.resetPassword.title')} subtitle={t('login.resetPassword.subtitle')}>
        <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          <WarningCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {t('login.resetPassword.missingToken')}
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          <Link to="/forgot-password" className="font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            {t('login.forgotPassword.title')}
          </Link>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={t('login.resetPassword.title')} subtitle={t('login.resetPassword.subtitle')}>
      <ResetPasswordForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
}
