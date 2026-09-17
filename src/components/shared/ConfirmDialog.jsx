import Dialog from '../ui/Dialog';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Confirmation modal for destructive/irreversible actions (delete team,
 * reject application, deactivate user, ...). Centralizing this means every
 * destructive action gets the same "are you sure" pattern for free.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isDestructive = true,
  isLoading = false,
}) {
  const { t } = useLanguage();
  return (
    <Dialog open={open} onClose={onClose} title={title ?? t('confirmDialog.defaultTitle')} description={description}>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelLabel ?? t('common.cancel')}
        </Button>
        <Button variant={isDestructive ? 'destructive' : 'primary'} onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel ?? t('common.confirm')}
        </Button>
      </div>
    </Dialog>
  );
}
