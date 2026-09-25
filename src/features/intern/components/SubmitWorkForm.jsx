import { useState } from 'react';
import UploadTypeField from '../../../components/shared/UploadTypeField';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../context/LanguageContext';
import { EMPTY_UPLOAD, validateUpload } from '../../../lib/uploadTypes';

export default function SubmitWorkForm({ onSubmit }) {
  const { t } = useLanguage();
  const [upload, setUpload] = useState(EMPTY_UPLOAD);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const invalid = validateUpload(upload);
    if (invalid) {
      setError(t(invalid));
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ ...upload, notes });
    } catch (err) {
      setError(err.message || t('intern.assignments.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <UploadTypeField
        id="submission"
        value={upload}
        onChange={setUpload}
        error={error}
        onError={setError}
        fileLabel={t('intern.assignments.attachWork')}
        fileHint={t('intern.assignments.fileHint')}
      />
      <Textarea id="submission-notes" label={t('intern.assignments.notesOptional')} value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {t('intern.assignments.submitWork')}
      </Button>
    </form>
  );
}
