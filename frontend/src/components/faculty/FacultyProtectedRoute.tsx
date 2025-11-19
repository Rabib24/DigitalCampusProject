"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFaculty } from "@/hooks/faculty/FacultyContext";
import { getUserData, hasRole } from "@/lib/auth";

interface FacultyProtectedRouteProps {
  children: React.ReactNode;
}

export function FacultyProtectedRoute({ children }: FacultyProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = () => {
      const userData = getUserData();
      
      if (!userData) {
        // No user data, redirect to login
        router.push("/login");
        return;
      }
      
      if (userData.role !== "faculty") {
        // User is not a faculty member, redirect to unauthorized page or login
        router.push("/unauthorized");
        return;
      }
      
      // User is authorized
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuthorization();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}