import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Role = "student" | "client" | "admin";

type Props = {
  children: React.ReactNode;
  requiredRole?: Role;
};

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { user, session, userRole, loading, isGuest } = useAuth();
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
  const location = useLocation();
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
  if (!session && !isGuest) return <Navigate to="/auth" replace />;

  // Role-gated routes (e.g., admin) must match exactly; guests have no role → redirect
  // If role is still loading/unknown but we have a session, show a small spinner instead of bouncing
  if (requiredRole) {
    if (!userRole && !waited) {
      return (
        <div className="min-h-screen grid place-items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }
    if (userRole !== requiredRole) {
      return (
        <Navigate
          to="/auth"
          replace
          state={{ requireRole: requiredRole, from: location.pathname }}
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

