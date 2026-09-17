import { useState } from 'react';
import FileDropzone from '../../../components/ui/FileDropzone';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import { fileToDataUrl } from '../../../lib/utils';
import { useLanguage } from '../../../context/LanguageContext';

export default function SubmitWorkForm({ onSubmit }) {
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError(t('intern.assignments.fileRequired'));
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const fileUrl = await fileToDataUrl(file);
      await onSubmit({ fileName: file.name, fileUrl, notes });
    } catch (err) {
      setError(err.message || t('intern.assignments.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FileDropzone
        id="submission-file"
        label={t('intern.assignments.attachWork')}
        required
        file={file}
        error={error}
        onChange={setFile}
        hint={t('intern.assignments.fileHint')}
        maxSizeMB={3}
      />
      <Textarea id="submission-notes" label={t('intern.assignments.notesOptional')} value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {t('intern.assignments.submitWork')}
      </Button>
    </form>
  );
}
