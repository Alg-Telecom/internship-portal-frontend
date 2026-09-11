import Dialog from '../ui/Dialog';
import Button from '../ui/Button';

/**
 * Confirmation modal for destructive/irreversible actions (delete team,
 * reject application, deactivate user, ...). Centralizing this means every
 * destructive action gets the same "are you sure" pattern for free.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button variant={isDestructive ? 'destructive' : 'primary'} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
