"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, hasRole, getUserData } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Check if user has the required role
    if (requiredRole && !hasRole(requiredRole)) {
      // Redirect to appropriate dashboard based on user's actual role
      const user = getUserData();
      if (user) {
        const roleMap: Record<string, string> = {
          student: "/student",
          faculty: "/faculty",
          advisor: "/advisor",
          admin: "/admin",
          finance: "/finance",
          library: "/library",
          research: "/research",
          "it-admin": "/it-admin",
        };
        router.push(roleMap[user.role] || "/login");
      } else {
        router.push("/login");
      }
      return;
    }
  }, [requiredRole, router]);

  // Show children only if authentication checks pass
  if (!isAuthenticated()) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
}