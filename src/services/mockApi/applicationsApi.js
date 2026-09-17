import { ApplicationStatus, Role } from '../../domain/enums';
import { getCollection, insert, update, findById, delay } from './db';
import { currentMaxId } from './seed';
import { createNotification } from './notificationsApi';
import { fileToDataUrl } from '../../lib/utils';

/**
 * Used by the apply wizard right after step 1 to warn about an existing
 * account early, instead of only at final submit. Mirrors the real
 * backend's GET /applications/check-email (see
 * services/api/applicationsApi.js#checkEmailExists) - true if the email
 * already belongs to a user account or to an application that's still
 * pending/accepted.
 */
export async function checkEmailExists(email) {
  await delay(200);
  const normalized = (email || '').toLowerCase();
  if (!normalized) return false;
  const hasUser = getCollection('users').some((u) => u.email.toLowerCase() === normalized);
  const hasActiveApplication = getCollection('applications').some(
    (a) => a.email.toLowerCase() === normalized && a.status !== ApplicationStatus.REJECTED && a.status !== ApplicationStatus.CANCELLED
  );
  return hasUser || hasActiveApplication;
}

/**
 * Accepts the raw `File` objects the apply wizard collects (cvFile,
 * photoFile, agreementFile, internshipRequestFile, otherDocuments[].file)
 * and reads them into base64 data: URLs itself - this is the mock's
 * equivalent of the real backend's multer middleware saving the upload to
 * disk and returning its URL (see services/api/applicationsApi.js). The
 * caller (ApplyPage) never has to know which one is happening.
 */
export async function submitApplication(data) {
  await delay(500);

  const [cvFileUrl, photoFileUrl, agreementFileUrl, internshipRequestFileUrl, otherDocuments] = await Promise.all([
    data.cvFile ? fileToDataUrl(data.cvFile) : '',
    data.photoFile ? fileToDataUrl(data.photoFile) : '',
    data.agreementFile ? fileToDataUrl(data.agreementFile) : '',
    data.internshipRequestFile ? fileToDataUrl(data.internshipRequestFile) : '',
    Promise.all(
      (data.otherDocuments || []).map(async (doc) => ({
        label: doc.label,
        fileName: doc.file?.name || '',
        fileUrl: doc.file ? await fileToDataUrl(doc.file) : '',
      }))
    ),
  ]);

  const id = currentMaxId('applications') + 1;
  const application = {
    id,
    firstName: data.firstName,
    lastName: data.lastName,
    personalId: data.personalId,
    email: data.email,
    phone: data.phone,
    birthday: data.birthday,
    password: data.password,
    university: data.university,
    major: data.major,
    grade: data.grade,
    teamPreference: data.teamPreference,
    startDate: data.startDate,
    endDate: data.endDate,
    cvFileName: data.cvFile?.name || '',
    cvFileUrl,
    photoFileName: data.photoFile?.name || '',
    photoFileUrl,
    agreementFileName: data.agreementFile?.name || '',
    agreementFileUrl,
    internshipRequestFileName: data.internshipRequestFile?.name || '',
    internshipRequestFileUrl,
    otherDocuments,
    submissionDate: new Date().toISOString().slice(0, 10),
    status: ApplicationStatus.PENDING,
    rejectionReason: '',
    reviewedAt: null,
    internId: null,
    // Per-document review state for the four required files attached to
    // the application itself (CV / photo / agreement letter / internship
    // request letter) — mirrors the sequence diagram's document-validation
    // ALT fragment, separate from the post-acceptance DocumentRequest
    // workflow in documentsApi.js.
    cvStatus: 'Pending',
    cvRejectionReason: '',
    photoStatus: 'Pending',
    photoRejectionReason: '',
    agreementStatus: 'Pending',
    agreementRejectionReason: '',
    internshipRequestStatus: 'Pending',
    internshipRequestRejectionReason: '',
  };
  insert('applications', application);

  // Notify every admin of the new application.
  const admins = getCollection('users').filter((u) => u.role === Role.ADMIN);
  admins.forEach((admin) =>
    createNotification({
      userId: admin.id,
      titleKey: 'notifications.newApplication.title',
      messageKey: 'notifications.newApplication.message',
      params: { name: `${data.firstName} ${data.lastName}` },
      notificationType: 'Application',
      link: `/admin/applications/${application.id}`,
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
 *
 * Since there's no resubmission path, a rejected document has nowhere to
 * go but a rejected application — so rejecting either document rejects
 * the application itself immediately, instead of leaving it stuck on
 * Pending until someone separately clicks "Reject Application".
 */
export async function reviewDocument(id, field, { status, rejectionReason = '' }) {
  await delay(300);
  const application = findById('applications', Number(id));
  const patch = {
    [`${field}Status`]: status,
    [`${field}RejectionReason`]: status === 'Rejected' ? rejectionReason : '',
  };
  if (status === 'Rejected' && application?.status === ApplicationStatus.PENDING) {
    patch.status = ApplicationStatus.REJECTED;
    patch.rejectionReason = rejectionReason;
    patch.reviewedAt = new Date().toISOString();
  }
  return update('applications', Number(id), patch);
}

/**
 * Accept or reject the application itself (separate from per-document
 * review — see reviewDocument above). On acceptance, creates/activates the
 * Intern user account, per the sequence diagram.
 *
 * `teamId` is the team the admin actually confirmed in the accept dialog
 * (AcceptApplicationDialog) — it starts pre-filled with whatever team
 * matches the candidate's stated preference, but the admin can swap it for
 * a different one before confirming, or leave the intern unassigned
 * (`null`/omitted). Whichever team ends up chosen, the welcome
 * notification says so explicitly, and calls it out when it differs from
 * what the candidate originally asked for — so nobody finds out they
 * didn't get their preferred team by quietly noticing it in their profile.
 */
export async function decideApplication(id, { status, rejectionReason = '', teamId } = {}) {
  await delay(400);
  const application = findById('applications', Number(id));
  if (!application) throw new Error('Application not found.');

  const patch = {
    status,
    rejectionReason: status === ApplicationStatus.REJECTED ? rejectionReason : '',
    reviewedAt: new Date().toISOString(),
  };

  if (status === ApplicationStatus.ACCEPTED) {
    const teams = getCollection('teams');
    const preferredTeam =
      application.teamPreference && application.teamPreference !== 'No preference'
        ? teams.find((t) => t.name === application.teamPreference)
        : null;

    // Explicit `teamId` (from the admin's confirmation dialog) is
    // authoritative. Only when a caller omits it entirely do we fall back
    // to auto-matching the stated preference, so existing/scripted calls
    // that don't know about the dialog still behave sensibly.
    const resolvedTeamId = teamId !== undefined ? (teamId ? Number(teamId) : null) : preferredTeam?.id ?? null;
    const assignedTeam = resolvedTeamId ? teams.find((t) => t.id === resolvedTeamId) : null;

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
      teamId: resolvedTeamId,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    insert('users', internUser);
    patch.internId = internUser.id;

    // Team names in this app already end in "Team" (e.g. "Digital Services
    // Team"), so the message doesn't append its own "team" suffix — doing
    // so read as "...Digital Services Team team".
    let messageKey = 'notifications.applicationAccepted.messageDefault';
    const params = {};
    if (assignedTeam && preferredTeam && assignedTeam.id === preferredTeam.id) {
      messageKey = 'notifications.applicationAccepted.messagePreferred';
      params.team = assignedTeam.name;
    } else if (assignedTeam && preferredTeam) {
      messageKey = 'notifications.applicationAccepted.messageOverridden';
      params.team = assignedTeam.name;
      params.preferredTeam = preferredTeam.name;
    } else if (assignedTeam) {
      messageKey = 'notifications.applicationAccepted.messageAssigned';
      params.team = assignedTeam.name;
    }

    createNotification({
      userId: internUser.id,
      titleKey: 'notifications.applicationAccepted.title',
      messageKey,
      params,
      notificationType: 'Application',
      link: '/intern',
    });
  }

  return update('applications', Number(id), patch);
}
