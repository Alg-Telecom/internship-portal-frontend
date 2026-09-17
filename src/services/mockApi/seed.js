import {
  Role,
  ApplicationStatus,
  TeamStatus,
  AssignmentStatus,
  AssignmentPriority,
  SubmissionStatus,
  AttendanceStatus,
  DocumentRequestStatus,
  DocumentStatus,
  DocumentType,
  NotificationType,
} from "../../domain/enums";
import { getCollection, setCollection, isSeeded, markSeeded } from "./db";
import { clearSession } from "./authApi";

export const DEMO_PASSWORD = "Password123";

/**
 * Bump this whenever the hardcoded records below change (a user, a team, a
 * status, ...). The database only reseeds when this differs from what's
 * stored in localStorage — without it, editing this file would have no
 * visible effect until someone manually clears the browser's storage,
 * since the mock "database" lives in the browser, not on disk.
 */
const SEED_VERSION = 6;

const today = new Date();
const iso = (offsetDays = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export function seedDatabase() {
  if (isSeeded(SEED_VERSION)) return;

  // The old data (and whatever session pointed into it) is about to be
  // replaced — log out so the next load lands on /login instead of
  // silently carrying a session over into the new demo data.
  clearSession();

  const users = [
    {
      id: 1,
      role: Role.ADMIN,
      firstName: "Sara",
      lastName: "Laribi",
      email: "admin@imp.dz",
      password: DEMO_PASSWORD,
      phoneNumber: "+213 555 10 10 10",
      createdAt: iso(-200),
      isActive: true,
    },
    {
      id: 2,
      role: Role.SUPERVISOR,
      firstName: "Lamia",
      lastName: "Belkaid",
      email: "lamia.belkaid@imp.dz",
      password: DEMO_PASSWORD,
      phoneNumber: "+213 555 20 20 20",
      specialization: "Network Engineering",
      department: "Infrastructure",
      createdAt: iso(-180),
      isActive: true,
    },
    {
      id: 3,
      role: Role.SUPERVISOR,
      firstName: "Wissam",
      lastName: "Nekkache",
      email: "wissam.nekkache@imp.dz",
      password: DEMO_PASSWORD,
      phoneNumber: "+213 555 30 30 30",
      specialization: "Software Development",
      department: "Digital Services",
      createdAt: iso(-180),
      isActive: true,
    },
    {
      id: 4,
      role: Role.INTERN,
      firstName: "Mehdi",
      lastName: "Laribi",
      email: "mehdi.laribi@imp.dz",
      password: DEMO_PASSWORD,
      phoneNumber: "+213 555 40 40 01",
      studentId: "USTHB-2025-041",
      university: "USTHB",
      fieldOfStudy: "Computer Science",
      academicLevel: "Master's, Year 2",
      registrationDate: iso(-60),
      teamId: 1,
      isActive: true,
      createdAt: iso(-60),
    },
    {
      id: 5,
      role: Role.INTERN,
      firstName: "Kamel",
      lastName: "Laribi",
      email: "kamel.laribi@imp.dz",
      password: DEMO_PASSWORD,
      phoneNumber: "+213 555 40 40 02",
      studentId: "ENSIA-2025-118",
      university: "ENSIA",
      fieldOfStudy: "Telecommunications",
      academicLevel: "Engineering, Year 5",
      registrationDate: iso(-58),
      teamId: 1,
      isActive: true,
      createdAt: iso(-58),
    },
    {
      id: 6,
      role: Role.INTERN,
      firstName: "Radia",
      lastName: "Belkaid",
      email: "radia.belkaid@imp.dz",
      password: DEMO_PASSWORD,
      phoneNumber: "+213 555 40 40 03",
      studentId: "USTHB-2025-077",
      university: "USTHB",
      fieldOfStudy: "Software Engineering",
      academicLevel: "Master's, Year 1",
      registrationDate: iso(-40),
      teamId: 2,
      isActive: true,
      createdAt: iso(-40),
    },
  ];

  const teams = [
    {
      id: 1,
      name: "Network Infrastructure Team",
      nameFr: "Équipe Infrastructure Réseau",
      nameAr: "فريق البنية التحتية للشبكات",
      description:
        "Interns working on network monitoring and infrastructure tooling.",
      startDate: iso(-60),
      endDate: iso(60),
      status: TeamStatus.ACTIVE,
      supervisorId: 2,
    },
    {
      id: 2,
      name: "Digital Services Team",
      nameFr: "Équipe Services Numériques",
      nameAr: "فريق الخدمات الرقمية",
      description:
        "Interns building internal digital-service web applications.",
      startDate: iso(-40),
      endDate: iso(80),
      status: TeamStatus.ACTIVE,
      supervisorId: 3,
    },
    {
      id: 3,
      name: "Development and Innovation Department",
      nameFr: "Direction de Développement et d'Innovation",
      nameAr: "إدارة التطوير والابتكار",
      description:
        "Interns working on R&D initiatives and new internal tooling for Algerie Telecom.",
      startDate: iso(0),
      endDate: iso(120),
      status: TeamStatus.PLANNED,
      supervisorId: null,
    },
  ];

  const applications = [
    {
      id: 1,
      firstName: "Mehdi",
      lastName: "Laribi",
      personalId: "ID-4471002",
      email: "mehdi.laribi@imp.dz",
      phone: "+213 555 40 40 01",
      birthday: "2001-03-12",
      university: "USTHB",
      major: "Computer Science",
      grade: "Master's",
      teamPreference: "Network Infrastructure Team",
      startDate: iso(-60),
      endDate: iso(60),
      cvFileName: "mehdi_laribi_cv.pdf",
      photoFileName: "mehdi_laribi_photo.jpg",
      agreementFileName: "mehdi_laribi_agreement.pdf",
      internshipRequestFileName: "mehdi_laribi_internship_request.pdf",
      otherDocuments: [],
      submissionDate: iso(-65),
      status: ApplicationStatus.ACCEPTED,
      rejectionReason: "",
      reviewedAt: iso(-62),
      internId: 4,
      cvStatus: DocumentStatus.APPROVED,
      cvRejectionReason: "",
      photoStatus: DocumentStatus.APPROVED,
      photoRejectionReason: "",
      agreementStatus: DocumentStatus.APPROVED,
      agreementRejectionReason: "",
      internshipRequestStatus: DocumentStatus.APPROVED,
      internshipRequestRejectionReason: "",
    },
    {
      id: 2,
      firstName: "Kamel",
      lastName: "Laribi",
      personalId: "ID-3382110",
      email: "kamel.laribi@imp.dz",
      phone: "+213 555 40 40 02",
      birthday: "2000-11-02",
      university: "ENSIA",
      major: "Telecommunications",
      grade: "Engineering",
      teamPreference: "Network Infrastructure Team",
      startDate: iso(-58),
      endDate: iso(62),
      cvFileName: "kamel_laribi_cv.pdf",
      photoFileName: "kamel_laribi_photo.jpg",
      agreementFileName: "kamel_laribi_agreement.pdf",
      internshipRequestFileName: "kamel_laribi_internship_request.pdf",
      otherDocuments: [],
      submissionDate: iso(-63),
      status: ApplicationStatus.ACCEPTED,
      rejectionReason: "",
      reviewedAt: iso(-60),
      internId: 5,
      cvStatus: DocumentStatus.APPROVED,
      cvRejectionReason: "",
      photoStatus: DocumentStatus.APPROVED,
      photoRejectionReason: "",
      agreementStatus: DocumentStatus.APPROVED,
      agreementRejectionReason: "",
      internshipRequestStatus: DocumentStatus.APPROVED,
      internshipRequestRejectionReason: "",
    },
    {
      id: 3,
      firstName: "Radia",
      lastName: "Belkaid",
      personalId: "ID-5501987",
      email: "radia.belkaid@imp.dz",
      phone: "+213 555 40 40 03",
      birthday: "2002-05-21",
      university: "USTHB",
      major: "Software Engineering",
      grade: "Master's",
      teamPreference: "Digital Services Team",
      startDate: iso(-40),
      endDate: iso(80),
      cvFileName: "radia_belkaid_cv.pdf",
      photoFileName: "radia_belkaid_photo.jpg",
      agreementFileName: "radia_belkaid_agreement.pdf",
      internshipRequestFileName: "radia_belkaid_internship_request.pdf",
      otherDocuments: [],
      submissionDate: iso(-45),
      status: ApplicationStatus.ACCEPTED,
      rejectionReason: "",
      reviewedAt: iso(-42),
      internId: 6,
      cvStatus: DocumentStatus.APPROVED,
      cvRejectionReason: "",
      photoStatus: DocumentStatus.APPROVED,
      photoRejectionReason: "",
      agreementStatus: DocumentStatus.APPROVED,
      agreementRejectionReason: "",
      internshipRequestStatus: DocumentStatus.APPROVED,
      internshipRequestRejectionReason: "",
    },
    {
      id: 4,
      firstName: "Ikram",
      lastName: "Nekkache",
      personalId: "ID-9903211",
      email: "ikram.nekkache@example.com",
      phone: "+213 555 40 40 04",
      birthday: "2001-08-09",
      university: "ESI Alger",
      major: "Computer Science",
      grade: "Engineering",
      teamPreference: "Digital Services Team",
      startDate: iso(10),
      endDate: iso(100),
      cvFileName: "ikram_nekkache_cv.pdf",
      photoFileName: "ikram_nekkache_photo.jpg",
      agreementFileName: "ikram_nekkache_agreement.pdf",
      internshipRequestFileName: "ikram_nekkache_internship_request.pdf",
      otherDocuments: [],
      submissionDate: iso(-3),
      status: ApplicationStatus.PENDING,
      rejectionReason: "",
      reviewedAt: null,
      internId: null,
      cvStatus: DocumentStatus.PENDING,
      cvRejectionReason: "",
      photoStatus: DocumentStatus.PENDING,
      photoRejectionReason: "",
      agreementStatus: DocumentStatus.PENDING,
      agreementRejectionReason: "",
      internshipRequestStatus: DocumentStatus.PENDING,
      internshipRequestRejectionReason: "",
    },
    {
      id: 5,
      firstName: "Amel",
      lastName: "Belkaid",
      personalId: "ID-1120456",
      email: "amel.belkaid@example.com",
      phone: "+213 555 40 40 05",
      birthday: "2003-01-30",
      university: "Universite Bejaia",
      major: "Information Systems",
      grade: "Bachelor's",
      teamPreference: "Network Infrastructure Team",
      startDate: iso(15),
      endDate: iso(105),
      cvFileName: "amel_belkaid_cv.pdf",
      photoFileName: "amel_belkaid_photo.jpg",
      agreementFileName: "amel_belkaid_agreement.pdf",
      internshipRequestFileName: "amel_belkaid_internship_request.pdf",
      otherDocuments: [{ label: "Motivation letter", fileName: "amel_belkaid_motivation_letter.pdf", fileUrl: "" }],
      submissionDate: iso(-1),
      status: ApplicationStatus.PENDING,
      rejectionReason: "",
      reviewedAt: null,
      internId: null,
      cvStatus: DocumentStatus.PENDING,
      cvRejectionReason: "",
      photoStatus: DocumentStatus.PENDING,
      photoRejectionReason: "",
      agreementStatus: DocumentStatus.PENDING,
      agreementRejectionReason: "",
      internshipRequestStatus: DocumentStatus.PENDING,
      internshipRequestRejectionReason: "",
    },
  ];

  const assignments = [
    {
      id: 1,
      teamId: 1,
      supervisorId: 2,
      internId: 4,
      title: "Network topology audit",
      description:
        "Document the current LAN/WAN topology for the Algiers regional site and flag redundancy gaps.",
      creationDate: iso(-30),
      deadline: iso(-10),
      status: AssignmentStatus.EVALUATED,
      priority: AssignmentPriority.HIGH,
    },
    {
      id: 2,
      teamId: 1,
      supervisorId: 2,
      internId: 4,
      title: "Monitoring dashboard proposal",
      description:
        "Propose a monitoring dashboard layout for uptime/latency KPIs across core routers.",
      creationDate: iso(-14),
      deadline: iso(3),
      status: AssignmentStatus.SUBMITTED,
      priority: AssignmentPriority.MEDIUM,
    },
    {
      id: 3,
      teamId: 1,
      supervisorId: 2,
      internId: 5,
      title: "VLAN segmentation report",
      description:
        "Analyze current VLAN segmentation and recommend improvements for the branch office rollout.",
      creationDate: iso(-20),
      deadline: iso(-2),
      status: AssignmentStatus.LATE,
      priority: AssignmentPriority.HIGH,
    },
    {
      id: 4,
      teamId: 1,
      supervisorId: 2,
      internId: 5,
      title: "Weekly status notes",
      description:
        "Keep a running log of daily tasks and blockers for the sprint review.",
      creationDate: iso(-5),
      deadline: iso(9),
      status: AssignmentStatus.PENDING,
      priority: AssignmentPriority.LOW,
    },
    {
      id: 5,
      teamId: 2,
      supervisorId: 3,
      internId: 6,
      title: "Internal ticketing UI mockups",
      description:
        "Design 3 mockups for the internal IT ticketing portal home screen.",
      creationDate: iso(-12),
      deadline: iso(2),
      status: AssignmentStatus.IN_PROGRESS,
      priority: AssignmentPriority.MEDIUM,
    },
  ];

  const submissions = [
    {
      id: 1,
      assignmentId: 1,
      internId: 4,
      fileName: "network_topology_audit.pdf",
      submissionDate: iso(-11),
      version: 1,
      grade: 17,
      feedback:
        "Thorough audit, clear diagrams. Add a short executive summary next time.",
      status: SubmissionStatus.ACCEPTED,
    },
    {
      id: 2,
      assignmentId: 2,
      internId: 4,
      fileName: "monitoring_dashboard_proposal.pdf",
      submissionDate: iso(-1),
      version: 1,
      grade: null,
      feedback: "",
      status: SubmissionStatus.SUBMITTED,
    },
  ];

  const attendance = [
    ...[6, 5, 4, 3, 2, 1, 0].map((offset, i) => ({
      id: i + 1,
      internId: 4,
      supervisorId: 2,
      date: iso(-offset),
      arrivalTime: offset === 3 ? null : "08:30",
      departureTime: offset === 3 ? null : "16:30",
      status:
        offset === 3
          ? AttendanceStatus.ABSENT
          : offset === 5
            ? AttendanceStatus.LATE
            : AttendanceStatus.PRESENT,
      remarks: offset === 3 ? "Medical appointment" : "",
    })),
    ...[4, 3, 2, 1, 0].map((offset, i) => ({
      id: 100 + i,
      internId: 5,
      supervisorId: 2,
      date: iso(-offset),
      arrivalTime: "08:45",
      departureTime: "16:30",
      status: AttendanceStatus.PRESENT,
      remarks: "",
    })),
  ];

  const documentRequests = [
    {
      id: 1,
      internId: 4,
      adminId: 1,
      title: "Signed Internship Agreement",
      description:
        "Please upload the internship agreement signed by your university and Algerie Telecom.",
      requestDate: iso(-55),
      deadline: iso(-45),
      status: DocumentRequestStatus.APPROVED,
      rejectionReason: "",
    },
    {
      id: 2,
      internId: 5,
      adminId: 1,
      title: "National ID copy",
      description: "Upload a clear scan of your national identity document.",
      requestDate: iso(-50),
      deadline: iso(-40),
      status: DocumentRequestStatus.REJECTED,
      rejectionReason: "Scan is blurry, please re-upload a clearer copy.",
    },
    {
      id: 3,
      internId: 6,
      adminId: 1,
      title: "End-of-internship Report",
      description: "Upload your final internship report (PDF, max 10MB).",
      requestDate: iso(-3),
      deadline: iso(20),
      status: DocumentRequestStatus.PENDING,
      rejectionReason: "",
    },
  ];

  const documents = [
    {
      id: 1,
      requestId: 1,
      internId: 4,
      fileName: "internship_agreement_signed.pdf",
      documentType: DocumentType.INTERNSHIP_AGREEMENT,
      uploadDate: iso(-48),
      version: 1,
      status: DocumentStatus.APPROVED,
      rejectionReason: "",
    },
    {
      id: 2,
      requestId: 2,
      internId: 5,
      fileName: "id_card.jpg",
      documentType: DocumentType.IDENTITY_DOCUMENT,
      uploadDate: iso(-47),
      version: 1,
      status: DocumentStatus.REJECTED,
      rejectionReason: "Scan is blurry, please re-upload a clearer copy.",
    },
  ];

  const notifications = [
    {
      id: 1,
      userId: 1,
      title: "New internship application",
      message: "Ikram Nekkache submitted an internship application.",
      creationDate: iso(-3),
      isRead: false,
      notificationType: NotificationType.APPLICATION,
      link: "/admin/applications/4",
    },
    {
      id: 2,
      userId: 1,
      title: "New internship application",
      message: "Amel Belkaid submitted an internship application.",
      creationDate: iso(-1),
      isRead: false,
      notificationType: NotificationType.APPLICATION,
      link: "/admin/applications/5",
    },
    {
      id: 3,
      userId: 4,
      title: "Assignment graded",
      message:
        'Your submission for "Network topology audit" was graded: 17/20.',
      creationDate: iso(-11),
      isRead: true,
      notificationType: NotificationType.EVALUATION,
      link: "/intern/assignments/1",
    },
    {
      id: 4,
      userId: 5,
      title: "Document rejected",
      message:
        'Your "National ID copy" document was rejected. Please resubmit.',
      creationDate: iso(-47),
      isRead: false,
      notificationType: NotificationType.DOCUMENT,
      link: "/intern/documents",
    },
  ];

  const calendarEvents = [
    {
      id: 1,
      title: "Network Infrastructure Team — Start",
      date: iso(-60),
      type: "start",
    },
    {
      id: 2,
      title: "Network Infrastructure Team — End",
      date: iso(60),
      type: "end",
    },
    {
      id: 3,
      title: "Digital Services Team — Start",
      date: iso(-40),
      type: "start",
    },
    { id: 4, title: "Digital Services Team — End", date: iso(80), type: "end" },
    {
      id: 5,
      title: "National Day (Public Holiday)",
      date: iso(25),
      type: "holiday",
    },
    {
      id: 6,
      title: "Mid-internship review meeting",
      date: iso(15),
      type: "event",
    },
  ];

  setCollection("users", users);
  setCollection("teams", teams);
  setCollection("applications", applications);
  setCollection("assignments", assignments);
  setCollection("submissions", submissions);
  setCollection("attendance", attendance);
  setCollection("documentRequests", documentRequests);
  setCollection("documents", documents);
  setCollection("notifications", notifications);
  setCollection("calendarEvents", calendarEvents);

  markSeeded(SEED_VERSION);
}

/** Used by id-generators in the other mockApi modules. */
export function currentMaxId(name) {
  const items = getCollection(name);
  return items.reduce((max, item) => Math.max(max, item.id), 0);
}
