import { useState } from 'react';
import FileDropzone from '../../../components/ui/FileDropzone';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import { fileToDataUrl } from '../../../lib/utils';

export default function SubmitWorkForm({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError('Please attach your work before submitting.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const fileUrl = await fileToDataUrl(file);
      await onSubmit({ fileName: file.name, fileUrl, notes });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FileDropzone id="submission-file" label="Attach your work" required file={file} error={error} onChange={setFile} hint="Any file type, max 20MB" />
      <Textarea id="submission-notes" label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Submit work
      </Button>
    </form>
  );
}
