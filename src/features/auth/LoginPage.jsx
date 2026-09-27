import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import LoginForm from './components/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  async function handleSubmit({ email, password }) {
    const loggedInUser = await login(email, password);
    showToast(t('common.welcomeBack', { name: loggedInUser.firstName }));
    const redirectTo = location.state?.from?.pathname || `/${loggedInUser.role}`;
    navigate(redirectTo, { replace: true });
  }

  return (
    <AuthLayout title={t('login.title')} subtitle={t('login.subtitle')} widthClassName="max-w-xl">
      <LoginForm onSubmit={handleSubmit} />
      <p className="mt-5 text-center text-sm text-muted-foreground">
        {t('login.applyingPrompt')}{' '}
        <Link to="/apply" className="whitespace-nowrap font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
          {t('login.submitApplication')}
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {t('login.cancelApplicationPrompt')}{' '}
        <Link to="/apply/cancel" className="whitespace-nowrap font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
          {t('login.cancelApplicationLink')}
        </Link>
      </p>
    </AuthLayout>
  );
}
