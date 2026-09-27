import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Prohibit, Eye, EyeSlash } from '@phosphor-icons/react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import LanguageSwitcher from '../../components/layout/LanguageSwitcher';
import { useCancelOwnApplication } from '../../hooks/useApplications';
import { useLanguage } from '../../context/LanguageContext';

// Public page — no login required. A candidate whose application is still
// Pending has no account yet, so this is the only way for them to cancel
// it themselves (see applicationsController.cancelOwnApplication).
export default function CancelApplicationPage() {
  const { t } = useLanguage();
  const cancelOwnApplication = useCancelOwnApplication();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    if (!email.trim() || !password) {
      setErrorMessage(t('apply.cancel.fieldsRequired'));
      setStatus('error');
      return;
    }
    try {
      await cancelOwnApplication.mutateAsync({ email: email.trim(), password });
      setStatus('success');
    } catch (err) {
      // 401 = wrong email/password or nothing pending — shown translated
      // rather than the backend's English message.
      setErrorMessage(err.status === 401 ? t('apply.cancel.invalidCredentials') : err.message || t('common.somethingWentWrong'));
      setStatus('error');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-10">
      <div className="mb-6 flex w-full max-w-md justify-end">
        <LanguageSwitcher />
      </div>
      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <Prohibit className="h-9 w-9 text-destructive" weight="fill" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">{t('apply.cancel.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('apply.cancel.subtitle')}</p>

        {status === 'success' ? (
          <>
            <p className="text-sm text-accent">{t('apply.cancel.success')}</p>
            <Link
              to="/login"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t('apply.success.backToSignIn')}
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex w-full flex-col gap-4 text-left">
            {status === 'error' && (
              <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                {errorMessage}
              </div>
            )}
            <Input
              id="cancel-application-email"
              type="email"
              label={t('login.email')}
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                id="cancel-application-password"
                type={showPassword ? 'text' : 'password'}
                label={t('login.password')}
                required
                autoComplete="current-password"
                helperText={t('apply.cancel.passwordHint')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                className="absolute end-3 top-9 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeSlash className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
            <Button type="submit" isLoading={cancelOwnApplication.isPending} className="w-full">
              {t('apply.cancel.submit')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
