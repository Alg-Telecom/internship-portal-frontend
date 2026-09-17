import { List } from '@phosphor-icons/react';
import NotificationBell from '../shared/NotificationBell';
import UserMenu from './UserMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';

export default function Topbar({ title, settingsPath, onOpenSidebar }) {
  const { t } = useLanguage();
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-sidebar-toggle
          onClick={onOpenSidebar}
          aria-label={t('topbar.openNavigation')}
          className="cursor-pointer rounded-md p-2 text-muted-foreground hover:bg-muted"
        >
          <List className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <NotificationBell />
        <UserMenu settingsPath={settingsPath} />
      </div>
    </header>
  );
}
