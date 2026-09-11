import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Restricts a route subtree to one role; redirects other roles to their own home. */
export default function RoleRoute({ role }) {
  const { user } = useAuth();
  if (user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return <Outlet />;
}
