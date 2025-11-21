"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface LibraryProtectedRouteProps {
  children: React.ReactNode;
}

export function LibraryProtectedRoute({ children }: LibraryProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Check if user is library staff
      if (!user || (user.role !== 'library' && user.role !== 'library_staff')) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    }
  }, [user, loading, router]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}