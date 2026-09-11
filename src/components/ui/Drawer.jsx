import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

/** Right-side slide-in panel — used for contextual detail views (e.g. InternProgressDrawer). */
export default function Drawer({ open, onClose, title, children, className }) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child as={Fragment} enter="ease-out duration-150" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-slate-900/50" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-y-0 right-0 flex max-w-full">
            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="translate-x-full" enterTo="translate-x-0" leave="ease-in duration-150" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className={cn('flex h-full w-screen max-w-md flex-col bg-card shadow-popover', className)}>
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <Dialog.Title className="text-base font-semibold text-foreground">{title}</Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close panel"
                    className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
