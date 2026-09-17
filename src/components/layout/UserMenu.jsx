import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretDown, Gear, SignOut } from '@phosphor-icons/react';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn, fullName } from '../../lib/utils';

export default function UserMenu({ settingsPath }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar firstName={user.firstName} lastName={user.lastName} photoUrl={user.profilePhotoUrl} size="sm" />
        <span className="hidden text-left sm:block">
          <span className="block text-sm font-medium leading-tight text-foreground">{fullName(user)}</span>
          <span className="block text-xs capitalize leading-tight text-muted-foreground">
            {t(`admin.users.role${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}`)}
          </span>
        </span>
        <CaretDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute end-0 z-20 mt-2 w-48 rounded-md border border-border bg-card py-1 shadow-popover focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={() => navigate(settingsPath)}
                className={cn('flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground', active && 'bg-muted')}
              >
                <Gear className="h-4 w-4" aria-hidden="true" />
                {t('topbar.settings')}
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                type="button"
                onClick={handleLogout}
                className={cn('flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-destructive', active && 'bg-destructive/5')}
              >
                <SignOut className="h-4 w-4" aria-hidden="true" />
                {t('topbar.logout')}
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
