import { useEffect, useRef, useState } from 'react';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../context/LanguageContext';

const MAX_PHOTO_MB = 2;

/**
 * The current photo (or the initials fallback) is always shown first —
 * picking a new one only swaps in a preview, never applies it straight
 * away, so there's always a "before" to compare against before Save.
 *
 * The preview uses a local object: URL (not the base64 approach this used
 * before the real backend existed) - it only needs to last until Save/Cancel,
 * and `onSave` uploads the actual `File` to the server (see
 * services/api/usersApi.js#uploadOwnPhoto), which returns the real,
 * persistent `/uploads/...` URL.
 */
export default function ProfilePhotoField({ user, onSave }) {
  const { t } = useLanguage();
  const inputRef = useRef(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFile(file) {
    if (!file) return;
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setError(
        t('fileDropzone.sizeError', { name: file.name, size: (file.size / (1024 * 1024)).toFixed(1), max: MAX_PHOTO_MB })
      );
      return;
    }
    setError('');
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(null);
    setPreviewUrl(null);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(previewFile);
      clearPreview();
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    clearPreview();
    setError('');
  }

  const displayedUrl = previewUrl || user.profilePhotoUrl;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Avatar firstName={user.firstName} lastName={user.lastName} photoUrl={displayedUrl} size="xl" />
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {previewUrl
            ? t('settings.previewPhoto')
            : user.profilePhotoUrl
              ? t('settings.currentPhoto')
              : t('settings.noPhoto')}
        </p>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            {t('settings.choosePhoto')}
          </Button>
          {previewUrl && (
            <>
              <Button type="button" size="sm" onClick={handleSave} isLoading={isSaving}>
                {t('settings.savePhoto')}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                {t('common.cancel')}
              </Button>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}
