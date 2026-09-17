import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Translate } from '@phosphor-icons/react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

export default function LanguageSwitcher({ variant = 'default' }) {
  const { language, setLanguage, languages, t } = useLanguage();

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        aria-label={t('topbar.language')}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          variant === 'onDark' ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-muted-foreground hover:bg-muted'
        )}
      >
        <Translate className="h-5 w-5" aria-hidden="true" />
        <span className="text-xs font-medium uppercase">{language}</span>
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
        <Menu.Items className="absolute end-0 z-20 mt-2 w-40 rounded-md border border-border bg-card py-1 shadow-popover focus:outline-none">
          {languages.map(({ code, label }) => (
            <Menu.Item key={code}>
              {({ active }) => (
                <button
                  type="button"
                  onClick={() => setLanguage(code)}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm text-foreground',
                    active && 'bg-muted',
                    code === language && 'font-semibold'
                  )}
                >
                  {label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
