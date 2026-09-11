import { Fragment } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { X } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

/**
 * Accessible modal built on Headless UI's Dialog (focus trap, Escape to
 * close, aria wiring included). Used for every create/edit form and
 * confirmation in the app instead of a hand-rolled overlay.
 */
export default function Dialog({ open, onClose, title, description, children, className }) {
  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className={cn('w-full max-w-lg rounded-lg bg-card shadow-popover', className)}>
                <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                  <div>
                    <HeadlessDialog.Title className="text-base font-semibold text-foreground">{title}</HeadlessDialog.Title>
                    {description && <HeadlessDialog.Description className="mt-1 text-sm text-muted-foreground">{description}</HeadlessDialog.Description>}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="cursor-pointer rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="px-5 py-4">{children}</div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
