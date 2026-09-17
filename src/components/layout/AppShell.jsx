import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { usePageTitle } from '../../context/PageTitleContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../lib/utils';

/**
 * Shared shell for every authenticated role: fixed sidebar on desktop,
 * off-canvas drawer on mobile/tablet, topbar with the current page title
 * (see PageTitleContext) + notifications + account menu, and the routed
 * page content in <Outlet/>.
 */
export default function AppShell({ navItems, roleLabel, settingsPath }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  // Persistent desktop sidebar — separate from the mobile overlay above,
  // since on desktop there's no backdrop to dismiss it, just a collapse/
  // expand toggle. Defaults open so the sidebar behaves exactly as before
  // unless someone actually collapses it.
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(true);
  const desktopSidebarRef = useRef(null);
  const title = usePageTitle();
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';

  // One topbar button drives both: below the lg breakpoint it opens the
  // overlay drawer, at/above it toggles the persistent sidebar instead.
  function handleToggleSidebar() {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setIsDesktopNavOpen((open) => !open);
    } else {
      setIsMobileNavOpen(true);
    }
  }

  // Headless UI's own outside-click/Escape close both go through a stack
  // machine that tracks which dialog is "on top" — under React StrictMode
  // (double-invoked effects in dev) that bookkeeping can get out of sync
  // and both stop firing, even though open state and calling onClose
  // directly still work fine. Handling Escape ourselves sidesteps that
  // entirely; the backdrop below gets its own onClick for the same reason.
  useEffect(() => {
    if (!isMobileNavOpen) return;
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsMobileNavOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavOpen]);

  // Desktop sidebar: clicking anywhere outside it (the page content) closes
  // it too, not just the toggle button — matches the expectation that
  // opening it that way is a temporary reveal, not a pinned state change.
  // The toggle button is excluded via data-sidebar-toggle so a click there
  // isn't double-handled (it already has its own onClick that toggles).
  useEffect(() => {
    if (!isDesktopNavOpen) return;
    function handleClickOutside(event) {
      if (!window.matchMedia('(min-width: 1024px)').matches) return;
      if (desktopSidebarRef.current?.contains(event.target)) return;
      if (event.target.closest('[data-sidebar-toggle]')) return;
      setIsDesktopNavOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktopNavOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div ref={desktopSidebarRef} className={isDesktopNavOpen ? 'hidden lg:flex' : 'hidden'}>
        <Sidebar navItems={navItems} roleLabel={roleLabel} />
      </div>

      {/*
        Headless UI v2: `open` must be passed to Dialog explicitly (rather
        than only via a wrapping <Transition show>, the old v1 pattern) —
        without it, the dialog's internal open/stack state never resolves
        correctly, and neither outside-click nor Escape close it.
      */}
      <Dialog open={isMobileNavOpen} onClose={setIsMobileNavOpen} className="relative z-40 lg:hidden" transition>
        <DialogBackdrop
          transition
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 bg-slate-900/50 transition-opacity duration-150 data-[closed]:opacity-0"
        />
        <div className="fixed inset-y-0 start-0 flex">
          <DialogPanel
            transition
            className={cn(
              'transition duration-150 ease-out',
              isRtl ? 'data-[closed]:translate-x-full' : 'data-[closed]:-translate-x-full'
            )}
          >
            <Sidebar navItems={navItems} roleLabel={roleLabel} onNavigate={() => setIsMobileNavOpen(false)} />
          </DialogPanel>
        </div>
      </Dialog>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} settingsPath={settingsPath} onOpenSidebar={handleToggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
