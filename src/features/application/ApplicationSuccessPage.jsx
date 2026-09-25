import { Link } from 'react-router-dom';
import { CheckCircle } from '@phosphor-icons/react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../../components/layout/LanguageSwitcher';

export default function ApplicationSuccessPage() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-10">
      <div className="mb-6 flex w-full max-w-md justify-end">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-1 max-w-md flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle className="h-9 w-9 text-accent" weight="fill" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">{t('apply.success.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('apply.success.body')}</p>
        <Link
          to="/login"
          className="mt-2 inline-flex h-11 items-center justify-center rounded-md border border-border bg-transparent px-4 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t('apply.success.backToSignIn')}
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('apply.success.cancelPrompt')}{' '}
          <Link to="/apply/cancel" className="font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            {t('apply.success.cancelLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
