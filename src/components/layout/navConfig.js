import {
  SquaresFour,
  FileText,
  Users,
  UsersThree,
  UserCircle,
  FolderSimple,
  ClipboardText,
  CalendarCheck,
  Key,
} from '@phosphor-icons/react';

export const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', icon: SquaresFour, end: true },
  { label: 'Applications', to: '/admin/applications', icon: FileText },
  { label: 'Interns', to: '/admin/interns', icon: UsersThree },
  { label: 'Teams', to: '/admin/teams', icon: UsersThree },
  { label: 'Users', to: '/admin/users', icon: Users },
  { label: 'Document Requests', to: '/admin/document-requests', icon: FolderSimple },
  { label: 'Change Password', to: '/admin/change-password', icon: Key },
];

export const SUPERVISOR_NAV = [
  { label: 'Dashboard', to: '/supervisor', icon: SquaresFour, end: true },
  { label: 'My Team', to: '/supervisor/team', icon: UsersThree },
  { label: 'Assignments', to: '/supervisor/assignments', icon: ClipboardText },
  { label: 'Attendance', to: '/supervisor/attendance', icon: CalendarCheck },
  { label: 'Change Password', to: '/supervisor/change-password', icon: Key },
];

export const INTERN_NAV = [
  { label: 'Profile', to: '/intern', icon: UserCircle, end: true },
  { label: 'Assignments', to: '/intern/assignments', icon: ClipboardText },
  { label: 'Attendance', to: '/intern/attendance', icon: CalendarCheck },
  { label: 'Documents', to: '/intern/documents', icon: FolderSimple },
  { label: 'Change Password', to: '/intern/change-password', icon: Key },
];
