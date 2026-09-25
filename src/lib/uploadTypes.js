// Ways an intern can hand in work (assignment submissions and requested
// documents). Must match backend/src/utils/uploadTypes.js.
export const UPLOAD_TYPES = ['File', 'Archive', 'Link'];
export const ARCHIVE_ACCEPT = '.zip,.rar,.7z,.tar,.gz,.tgz,.bz2,.xz';
export const ARCHIVE_EXTENSIONS = ARCHIVE_ACCEPT.split(',');
export const FILE_MAX_MB = 3;
export const ARCHIVE_MAX_MB = 20;

export function isArchiveName(name) {
  const lower = name.toLowerCase();
  return ARCHIVE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function isValidHttpUrl(value) {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const EMPTY_UPLOAD = { uploadType: 'File', file: null, link: '' };

// Returns an i18n key describing what's missing/wrong, or '' when valid.
export function validateUpload({ uploadType, file, link }) {
  if (uploadType === 'Link') return isValidHttpUrl(link) ? '' : 'upload.linkInvalid';
  if (!file) return uploadType === 'Archive' ? 'upload.archiveRequired' : 'upload.fileRequired';
  return '';
}

// Appends uploadType + file or link to a FormData for the backend.
export function appendUpload(formData, { uploadType, file, link }) {
  formData.append('uploadType', uploadType);
  if (uploadType === 'Link') formData.append('link', link.trim());
  else formData.append('file', file);
}
