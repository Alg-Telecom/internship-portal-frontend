import { Routes, Route, Navigate } from "react-router-dom";
import ApplyPage from "../features/application/ApplyPage";
import ApplicationSuccessPage from "../features/application/ApplicationSuccessPage";

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
    </Routes>
  );
}
