import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Prohibit } from '@phosphor-icons/react';
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
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    try {
      await cancelOwnApplication.mutateAsync(email);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || t('common.somethingWentWrong'));
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
            <Button type="submit" isLoading={cancelOwnApplication.isPending} className="w-full">
              {t('apply.cancel.submit')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
