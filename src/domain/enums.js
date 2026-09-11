export const Role = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  INTERN: 'intern',
};

export const ApplicationStatus = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

export const TeamStatus = {
  PLANNED: 'Planned',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const AssignmentStatus = {
  PENDING: 'Pending',
  IN_PROGRESS: 'InProgress',
  SUBMITTED: 'Submitted',
  EVALUATED: 'Evaluated',
  LATE: 'Late',
};

export const AssignmentPriority = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const SubmissionStatus = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'UnderReview',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
};

export const AttendanceStatus = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  JUSTIFIED: 'Justified',
};

export const DocumentRequestStatus = {
  PENDING: 'Pending',
  SUBMITTED: 'Submitted',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
};

export const DocumentType = {
  CV: 'CV',
  MOTIVATION_LETTER: 'MotivationLetter',
  INTERNSHIP_AGREEMENT: 'InternshipAgreement',
  IDENTITY_DOCUMENT: 'IdentityDocument',
  REPORT: 'Report',
  CERTIFICATE: 'Certificate',
  OTHER: 'Other',
};

export const DocumentStatus = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const NotificationType = {
  APPLICATION: 'Application',
  ASSIGNMENT: 'Assignment',
  DOCUMENT: 'Document',
  ATTENDANCE: 'Attendance',
  EVALUATION: 'Evaluation',
  SYSTEM: 'System',
};


export const STATUS_TONE = {
  Pending: 'warning',
  Accepted: 'success',
  Approved: 'success',
  Rejected: 'destructive',
  Cancelled: 'muted',
  Submitted: 'info',
  UnderReview: 'info',
  InProgress: 'info',
  Evaluated: 'success',
  Late: 'destructive',
  Present: 'success',
  Absent: 'destructive',
  Justified: 'info',
  Planned: 'muted',
  Active: 'success',
  Completed: 'muted',
};
