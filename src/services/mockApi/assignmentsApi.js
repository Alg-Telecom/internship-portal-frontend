import { AssignmentStatus, SubmissionStatus } from '../../domain/enums';
import { getCollection, insert, update, findById, delay } from './db';
import { currentMaxId } from './seed';
import { createNotification } from './notificationsApi';

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
    title: 'New assignment',
    message: `A new assignment "${data.title}" has been created for you.`,
    notificationType: 'Assignment',
    link: `/intern/assignments/${id}`,
  });
  return assignment;
}

export async function updateAssignment(id, patch) {
  await delay(300);
  return update('assignments', Number(id), patch);
}

export async function submitWork(assignmentId, { fileName, fileUrl, notes }) {
  await delay(500);
  const id = currentMaxId('submissions') + 1;
  const assignment = findById('assignments', Number(assignmentId));
  const submission = {
    id,
    assignmentId: Number(assignmentId),
    internId: assignment.internId,
    fileName,
    // Object URL for this tab session only — see components/shared/DocumentLink.
    fileUrl: fileUrl || '',
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
    title: 'Assignment submitted',
    message: `A submission is ready for review: "${assignment.title}".`,
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
    title: 'Assignment graded',
    message: `Your submission was graded: ${grade}/20.`,
    notificationType: 'Evaluation',
    link: `/intern/assignments/${submission.assignmentId}`,
  });

  return updated;
}
