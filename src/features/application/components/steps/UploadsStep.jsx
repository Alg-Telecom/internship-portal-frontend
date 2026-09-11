import FileDropzone from '../../../../components/ui/FileDropzone';

export default function UploadsStep({ errors, watch, setValue }) {
  const cvFile = watch('cvFile');
  const photoFile = watch('photoFile');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FileDropzone
        id="cvFile"
        label="Upload CV"
        required
        accept=".pdf,.doc,.docx"
        hint="PDF or Word, max 5MB"
        file={cvFile}
        error={errors.cvFile?.message}
        onChange={(file) => setValue('cvFile', file, { shouldValidate: true })}
      />
      <FileDropzone
        id="photoFile"
        label="Upload Photo"
        required
        accept="image/*"
        hint="JPG or PNG, max 5MB"
        file={photoFile}
        error={errors.photoFile?.message}
        onChange={(file) => setValue('photoFile', file, { shouldValidate: true })}
      />
    </div>
  );
}
