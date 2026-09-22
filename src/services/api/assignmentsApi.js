import { http, resolveFileUrl } from './httpClient';

function resolveSubmissionUrls(submission) {
  if (!submission) return submission;
  return { ...submission, fileUrl: resolveFileUrl(submission.fileUrl) };
}

function resolveAssignmentUrls(assignment) {
  if (!assignment) return assignment;
  const submissions = (assignment.submissions || []).map(resolveSubmissionUrls);
  return {
    ...assignment,
    submissions,
    // Convenience singular field the UI reads (assignment.submission) —
    // the real backend only returns the `submissions` array (an intern is
    // expected to submit once per assignment, but nothing stops multiple
    // rows), so this picks the most recently created one, same as the
    // mock backend used to provide directly.
    submission: submissions.length ? submissions[submissions.length - 1] : null,
  };
}

export async function getAssignments(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, value);
  });
  const query = params.toString() ? `?${params.toString()}` : '';
  const assignments = await http.get(`/assignments${query}`);
  return assignments.map(resolveAssignmentUrls);
}

export async function getAssignment(id) {
  const assignment = await http.get(`/assignments/${id}`);
  return resolveAssignmentUrls(assignment);
}

export async function createAssignment(data) {
  const assignment = await http.post('/assignments', data);
  return resolveAssignmentUrls(assignment);
}

export async function updateAssignment(id, patch) {
  const assignment = await http.patch(`/assignments/${id}`, patch);
  return resolveAssignmentUrls(assignment);
}

// Intern submits their work: a single File object plus optional notes.
export async function submitWork(assignmentId, file, notes) {
  const formData = new FormData();
  formData.append('file', file);
  if (notes) formData.append('notes', notes);
  const submission = await http.post(`/assignments/${assignmentId}/submissions`, formData, {
    isFormData: true,
  });
  return resolveSubmissionUrls(submission);
}
