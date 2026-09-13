import { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import LoginForm from './components/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  async function handleSubmit({ email, password }) {
    const loggedInUser = await login(email, password);
    showToast(`Welcome back, ${loggedInUser.firstName}.`);
    const redirectTo = location.state?.from?.pathname || `/${loggedInUser.role}`;
    navigate(redirectTo, { replace: true });
  }

  return (
    <AuthLayout title="Internship Management Portal" subtitle="Sign in to continue">
      <LoginForm onSubmit={handleSubmit} />
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Applying for an internship?{' '}
        <Link to="/apply" className="font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
          Submit an application
        </Link>
      </p>
    </AuthLayout>
  );
}
