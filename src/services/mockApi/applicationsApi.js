import { ApplicationStatus, Role } from '../../domain/enums';
import { getCollection, insert, update, findById, delay } from './db';
import { currentMaxId } from './seed';
import { createNotification } from './notificationsApi';

export async function submitApplication(data) {
  await delay(500);
  const id = currentMaxId('applications') + 1;
  const application = {
    id,
    ...data,
    submissionDate: new Date().toISOString().slice(0, 10),
    status: ApplicationStatus.PENDING,
    rejectionReason: '',
    reviewedAt: null,
    internId: null,
    // Per-document review state for the two files attached to the
    // application itself (CV / photo) — mirrors the sequence diagram's
    // document-validation ALT fragment, separate from the post-acceptance
    // DocumentRequest workflow in documentsApi.js.
    cvStatus: 'Pending',
    cvRejectionReason: '',
    photoStatus: 'Pending',
    photoRejectionReason: '',
  };
  insert('applications', application);

  // Notify every admin of the new application.
  const admins = getCollection('users').filter((u) => u.role === Role.ADMIN);
  admins.forEach((admin) =>
    createNotification({
      userId: admin.id,
      title: 'New internship application',
      message: `${data.firstName} ${data.lastName} submitted an internship application.`,
      notificationType: 'Application',
    })
  );

  return application;
}

export async function listApplications(filters = {}) {
  await delay();
  let items = getCollection('applications');
  if (filters.status) items = items.filter((a) => a.status === filters.status);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter((a) => `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(q));
  }
  return items.sort((a, b) => (a.submissionDate < b.submissionDate ? 1 : -1));
}

export async function getApplication(id) {
  await delay();
  const application = findById('applications', Number(id));
  if (!application) throw new Error('Application not found.');
  return application;
}

/**
 * Accept or reject one of the two documents attached to the application
 * (`field` is 'cv' or 'photo') — the ALT fragment from the sequence
 * diagram. Rejecting sets a reason the candidate would see if resubmission
 * were wired up (not implemented client-side for the mock, since the
 * candidate has no authenticated session before acceptance).
 */
export async function reviewDocument(id, field, { status, rejectionReason = '' }) {
  await delay(300);
  const patch = {
    [`${field}Status`]: status,
    [`${field}RejectionReason`]: status === 'Rejected' ? rejectionReason : '',
  };
  return update('applications', Number(id), patch);
}

/**
 * Accept or reject the application itself (separate from per-document
 * review — see reviewDocument above). On acceptance, creates/activates the
 * Intern user account, per the sequence diagram.
 */
export async function decideApplication(id, { status, rejectionReason = '' }) {
  await delay(400);
  const application = findById('applications', Number(id));
  if (!application) throw new Error('Application not found.');

  const patch = {
    status,
    rejectionReason: status === ApplicationStatus.REJECTED ? rejectionReason : '',
    reviewedAt: new Date().toISOString(),
  };

  if (status === ApplicationStatus.ACCEPTED) {
    const newUserId = currentMaxId('users') + 1;
    const internUser = {
      id: newUserId,
      role: Role.INTERN,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      // Uses the password the applicant chose on the apply form. Falls
      // back only for legacy/seeded applications created before that
      // field existed. Plaintext storage is mock-only, same as every
      // other password in this mock layer — the real backend will hash it.
      password: application.password || 'Welcome123!',
      phoneNumber: application.phone,
      studentId: application.personalId,
      university: application.university,
      fieldOfStudy: application.major,
      academicLevel: application.grade,
      cvPath: application.cvFileName,
      registrationDate: new Date().toISOString().slice(0, 10),
      teamId: null,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    insert('users', internUser);
    patch.internId = internUser.id;

    createNotification({
      userId: internUser.id,
      title: 'Application accepted',
      message: 'Your internship application has been accepted. Welcome to Algerie Telecom!',
      notificationType: 'Application',
    });
  }

  return update('applications', Number(id), patch);
}
