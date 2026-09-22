import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import * as authApi from '../../services/api/authApi';
import { useLanguage } from '../../context/LanguageContext';

export default function ForgotPasswordPage() {
  const { t } = useLanguage();

  async function handleSubmit({ email }) {
    await authApi.forgotPassword(email);
  }

  return (
    <AuthLayout title={t('login.forgotPassword.title')} subtitle={t('login.forgotPassword.subtitle')}>
      <ForgotPasswordForm onSubmit={handleSubmit} />
      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
          {t('login.forgotPassword.backToLogin')}
        </Link>
      </p>
    </AuthLayout>
  );
}
