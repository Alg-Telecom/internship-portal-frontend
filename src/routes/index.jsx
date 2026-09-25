import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/layout/ProtectedRoute';
import RoleRoute from '../components/layout/RoleRoute';
import AppShell from '../components/layout/AppShell';
import { ADMIN_NAV, SUPERVISOR_NAV, INTERN_NAV } from '../components/layout/navConfig';
import { Role } from '../domain/enums';

import LoginPage from '../features/auth/LoginPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import SettingsPage from '../features/auth/SettingsPage';
import ApplyPage from '../features/application/ApplyPage';
import ApplicationSuccessPage from '../features/application/ApplicationSuccessPage';
import CancelApplicationPage from '../features/application/CancelApplicationPage';

import AdminDashboardPage from '../features/admin/DashboardPage';
import ApplicationsListPage from '../features/admin/ApplicationsListPage';
import ApplicationReviewPage from '../features/admin/ApplicationReviewPage';
import InternsListPage from '../features/admin/InternsListPage';
import InternDetailPage from '../features/admin/InternDetailPage';
import TeamsPage from '../features/admin/TeamsPage';
import UsersPage from '../features/admin/UsersPage';
import DocumentRequestsPage from '../features/admin/DocumentRequestsPage';
import DocumentRequestDetailPage from '../features/admin/DocumentRequestDetailPage';

import SupervisorDashboardPage from '../features/supervisor/DashboardPage';
import TeamPage from '../features/supervisor/TeamPage';
import SupervisorAssignmentsPage from '../features/supervisor/AssignmentsPage';
import SupervisorAssignmentDetailPage from '../features/supervisor/AssignmentDetailPage';
import SupervisorAttendancePage from '../features/supervisor/AttendancePage';

import ProfilePage from '../features/intern/ProfilePage';
import InternAssignmentsPage from '../features/intern/AssignmentsPage';
import InternAssignmentDetailPage from '../features/intern/AssignmentDetailPage';
import InternAttendancePage from '../features/intern/AttendancePage';
import DocumentsPage from '../features/intern/DocumentsPage';

/**
 * Central route tree. Public routes (apply, login) sit outside the
 * ProtectedRoute guard; everything else requires a session, and each
 * role's subtree is additionally fenced by RoleRoute so one role can never
 * browse into another's pages by URL.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/apply/success" element={<ApplicationSuccessPage />} />
      <Route path="/apply/cancel" element={<CancelApplicationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role={Role.ADMIN} />}>
          <Route element={<AppShell navItems={ADMIN_NAV} roleLabel="Administrator" settingsPath="/admin/change-password" />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/applications" element={<ApplicationsListPage />} />
            <Route path="/admin/applications/:id" element={<ApplicationReviewPage />} />
            <Route path="/admin/interns" element={<InternsListPage />} />
            <Route path="/admin/interns/:id" element={<InternDetailPage />} />
            <Route path="/admin/teams" element={<TeamsPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/document-requests" element={<DocumentRequestsPage />} />
            <Route path="/admin/document-requests/:id" element={<DocumentRequestDetailPage />} />
            <Route path="/admin/change-password" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute role={Role.SUPERVISOR} />}>
          <Route element={<AppShell navItems={SUPERVISOR_NAV} roleLabel="Supervisor" settingsPath="/supervisor/change-password" />}>
            <Route path="/supervisor" element={<SupervisorDashboardPage />} />
            <Route path="/supervisor/team" element={<TeamPage />} />
            <Route path="/supervisor/assignments" element={<SupervisorAssignmentsPage />} />
            <Route path="/supervisor/assignments/:id" element={<SupervisorAssignmentDetailPage />} />
            <Route path="/supervisor/attendance" element={<SupervisorAttendancePage />} />
            <Route path="/supervisor/change-password" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute role={Role.INTERN} />}>
          <Route element={<AppShell navItems={INTERN_NAV} roleLabel="Intern" settingsPath="/intern/change-password" />}>
            <Route path="/intern" element={<ProfilePage />} />
            <Route path="/intern/assignments" element={<InternAssignmentsPage />} />
            <Route path="/intern/assignments/:id" element={<InternAssignmentDetailPage />} />
            <Route path="/intern/attendance" element={<InternAttendancePage />} />
            <Route path="/intern/documents" element={<DocumentsPage />} />
            <Route path="/intern/change-password" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
