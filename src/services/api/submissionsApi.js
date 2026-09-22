import { http, resolveFileUrl } from './httpClient';

function resolveSubmissionUrls(submission) {
  if (!submission) return submission;
  return { ...submission, fileUrl: resolveFileUrl(submission.fileUrl) };
}

// grade is required by the backend; feedback is optional.
export async function evaluateSubmission(id, grade, feedback) {
  const submission = await http.patch(`/submissions/${id}/evaluate`, { grade, feedback });
  return resolveSubmissionUrls(submission);
}
