import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Role = "student" | "client" | "admin" | "developer";

type Props = {
  children: React.ReactNode;
  requiredRole?: Role;
};

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const { user, session, userRole, loading, isGuest } = useAuth();
  const location = useLocation();
  const [waited, setWaited] = React.useState(false);

  // Safety valve for any slow/failed auth fetch: stop showing spinner after 5s
  React.useEffect(() => {
    const id = setTimeout(() => setWaited(true), 5000);
    return () => clearTimeout(id);
  }, []);

  if (loading && !waited) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Guests can browse most pages, but block specific client actions
  const restrictedForGuests = new Set<string>(["/post-job", "/manage-jobs", "/client-dashboard"]);
  if (isGuest && restrictedForGuests.has(location.pathname)) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ signup: true, from: location.pathname }}
      />
    );
  }

  // Not authenticated (and not a guest) → go to auth
  // Treat an existing session as authenticated even if user is still populating
  if (!session && !isGuest) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ signup: true, from: location.pathname }}
      />
    );
  }

  // Enhanced role-based access control
  // Admins (and developers) can access everything
  if (userRole === 'admin' || userRole === 'developer') {
    return <>{children}</>;
  }

  // If role is still loading/unknown but we have a session, show a small spinner instead of bouncing
  if (!userRole && !waited) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Define route access
  const path = location.pathname;
  const isClientPage = path.startsWith('/client') || [
    '/', '/browse-jobs', '/my-applications', '/saved-jobs', '/job', '/profile', '/manage-jobs', '/post-job', '/waitlist', '/browse-students', '/student', '/view-student', '/all-resources', '/resources', '/student/resources'
  ].some(p => path === p || path.startsWith(p + '/'));
  const isStudentPage = path.startsWith('/student') || path.startsWith('/view-student') || path === '/student-dashboard' || path === '/resources' || path === '/all-resources' || path === '/browse-students';

  if (userRole === 'student') {
    // Students can access student and client pages
    if (isStudentPage || isClientPage) {
      return <>{children}</>;
    }
    // Otherwise, block
    return <Navigate to="/" replace state={{ from: path }} />;
  }

  if (userRole === 'client') {
    // Clients can only access client pages
    if (isClientPage) {
      return <>{children}</>;
    }
    // Otherwise, block
    return <Navigate to="/" replace state={{ from: path }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
