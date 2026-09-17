import {
  SquaresFour,
  FileText,
  Users,
  UsersThree,
  UserCircle,
  FolderSimple,
  ClipboardText,
  CalendarCheck,
  Gear,
} from '@phosphor-icons/react';

export const ADMIN_NAV = [
  { labelKey: 'nav.dashboard', to: '/admin', icon: SquaresFour, end: true },
  { labelKey: 'nav.applications', to: '/admin/applications', icon: FileText },
  { labelKey: 'nav.interns', to: '/admin/interns', icon: UsersThree },
  { labelKey: 'nav.teams', to: '/admin/teams', icon: UsersThree },
  { labelKey: 'nav.users', to: '/admin/users', icon: Users },
  { labelKey: 'nav.documentRequests', to: '/admin/document-requests', icon: FolderSimple },
  { labelKey: 'nav.settings', to: '/admin/change-password', icon: Gear },
];

export const SUPERVISOR_NAV = [
  { labelKey: 'nav.dashboard', to: '/supervisor', icon: SquaresFour, end: true },
  { labelKey: 'nav.myTeams', to: '/supervisor/team', icon: UsersThree },
  { labelKey: 'nav.assignments', to: '/supervisor/assignments', icon: ClipboardText },
  { labelKey: 'nav.attendance', to: '/supervisor/attendance', icon: CalendarCheck },
  { labelKey: 'nav.settings', to: '/supervisor/change-password', icon: Gear },
];

export const INTERN_NAV = [
  { labelKey: 'nav.profile', to: '/intern', icon: UserCircle, end: true },
  { labelKey: 'nav.assignments', to: '/intern/assignments', icon: ClipboardText },
  { labelKey: 'nav.attendance', to: '/intern/attendance', icon: CalendarCheck },
  { labelKey: 'nav.documents', to: '/intern/documents', icon: FolderSimple },
  { labelKey: 'nav.settings', to: '/intern/change-password', icon: Gear },
];
