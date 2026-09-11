import { Fragment, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { usePageTitle } from '../../context/PageTitleContext';

/**
 * Shared shell for every authenticated role: fixed sidebar on desktop,
 * off-canvas drawer on mobile/tablet, topbar with the current page title
 * (see PageTitleContext) + notifications + account menu, and the routed
 * page content in <Outlet/>.
 */
export default function AppShell({ navItems, roleLabel, changePasswordPath }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const title = usePageTitle();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar navItems={navItems} roleLabel={roleLabel} className="hidden lg:flex" />

      <Transition show={isMobileNavOpen} as={Fragment}>
        <Dialog onClose={() => setIsMobileNavOpen(false)} className="relative z-40 lg:hidden">
          <Transition.Child as={Fragment} enter="ease-out duration-150" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-slate-900/50" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child as={Fragment} enter="ease-out duration-150" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="ease-in duration-100" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
            <Dialog.Panel className="fixed inset-y-0 left-0">
              <Sidebar navItems={navItems} roleLabel={roleLabel} onNavigate={() => setIsMobileNavOpen(false)} />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} changePasswordPath={changePasswordPath} onOpenSidebar={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
