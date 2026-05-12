import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const publicRoutes = new Set(["/", "/login", "/terms", "/account-deletion"]);

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const isPublic = publicRoutes.has(location.pathname) || location.pathname.startsWith("/auth/callback");

  if (!session && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  if (session && (location.pathname === "/" || location.pathname === "/login")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
