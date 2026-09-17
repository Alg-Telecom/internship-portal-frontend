import { AssignmentStatus, SubmissionStatus } from '../../domain/enums';
import { getCollection, insert, update, findById, delay } from './db';
import { currentMaxId } from './seed';
import { createNotification } from './notificationsApi';
import { fileToDataUrl } from '../../lib/utils';

function attachSubmission(assignment) {
  const submission = getCollection('submissions').find((s) => s.assignmentId === assignment.id) || null;
  return { ...assignment, submission };
}

export async function listAssignments(filters = {}) {
  await delay();
  let items = getCollection('assignments');
  if (filters.internId) items = items.filter((a) => a.internId === Number(filters.internId));
  if (filters.supervisorId) items = items.filter((a) => a.supervisorId === Number(filters.supervisorId));
  if (filters.status) items = items.filter((a) => a.status === filters.status);
  return items.map(attachSubmission).sort((a, b) => (a.deadline < b.deadline ? -1 : 1));
}

export async function getAssignment(id) {
  await delay();
  const assignment = findById('assignments', Number(id));
  if (!assignment) throw new Error('Assignment not found.');
  return attachSubmission(assignment);
}

export async function createAssignment(data) {
  await delay(400);
  const id = currentMaxId('assignments') + 1;
  const assignment = {
    id,
    status: AssignmentStatus.PENDING,
    creationDate: new Date().toISOString().slice(0, 10),
    ...data,
  };
  insert('assignments', assignment);
  createNotification({
    userId: data.internId,
    titleKey: 'notifications.newAssignment.title',
    messageKey: 'notifications.newAssignment.message',
    params: { title: data.title },
    notificationType: 'Assignment',
    link: `/intern/assignments/${id}`,
  });
  return assignment;
}

export async function updateAssignment(id, patch) {
  await delay(300);
  return update('assignments', Number(id), patch);
}

/**
 * Accepts the raw `File` the intern picked and reads it into a base64
 * data: URL itself — the mock's equivalent of the real backend's multer
 * middleware saving the upload to disk and returning its URL (see
 * services/api/assignmentsApi.js#submitWork). The caller
 * (features/intern/AssignmentDetailPage) never has to know which one is
 * happening.
 */
export async function submitWork(assignmentId, { file, notes }) {
  await delay(500);
  const id = currentMaxId('submissions') + 1;
  const assignment = findById('assignments', Number(assignmentId));
  if (!assignment) throw new Error('Assignment not found.');
  const fileUrl = file ? await fileToDataUrl(file) : '';
  const submission = {
    id,
    assignmentId: Number(assignmentId),
    internId: assignment.internId,
    fileName: file?.name || '',
    fileUrl,
    notes: notes || '',
    submissionDate: new Date().toISOString(),
    version: 1,
    grade: null,
    feedback: '',
    status: SubmissionStatus.SUBMITTED,
  };
  insert('submissions', submission);
  update('assignments', Number(assignmentId), { status: AssignmentStatus.SUBMITTED });
  createNotification({
    userId: assignment.supervisorId,
    titleKey: 'notifications.assignmentSubmitted.title',
    messageKey: 'notifications.assignmentSubmitted.message',
    params: { title: assignment.title },
    notificationType: 'Assignment',
    link: `/supervisor/assignments/${assignment.id}`,
  });
  return submission;
}

export async function evaluateSubmission(submissionId, { grade, feedback }) {
  await delay(400);
  const submissions = getCollection('submissions');
  const submission = submissions.find((s) => s.id === Number(submissionId));
  if (!submission) throw new Error('Submission not found.');

  const updated = update('submissions', Number(submissionId), {
    grade,
    feedback,
    status: SubmissionStatus.ACCEPTED,
  });
  update('assignments', submission.assignmentId, { status: AssignmentStatus.EVALUATED });

  createNotification({
    userId: submission.internId,
    titleKey: 'notifications.assignmentGraded.title',
    messageKey: 'notifications.assignmentGraded.message',
    params: { grade },
    notificationType: 'Evaluation',
    link: `/intern/assignments/${submission.assignmentId}`,
  });

  return updated;
}
