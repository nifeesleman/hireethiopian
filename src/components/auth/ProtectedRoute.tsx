import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("worker" | "agency" | "admin")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading, emailVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Redirect to login with return URL
      const loginPath = location.pathname.includes("admin")
        ? "/login/admin"
        : location.pathname.includes("agency")
        ? "/login/agency"
        : "/login/worker";
      navigate(loginPath, { replace: true });
      return;
    }

    if (!emailVerified) {
      // Redirect to login with message about email verification
      navigate("/login/worker", { replace: true });
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      // User doesn't have the required role, redirect to their dashboard
      const dashboardPath =
        role === "admin"
          ? "/dashboard/admin"
          : role === "agency"
          ? "/dashboard/agency"
          : "/dashboard/worker";
      navigate(dashboardPath, { replace: true });
    }
  }, [user, role, loading, emailVerified, allowedRoles, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !emailVerified) {
    return null;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
