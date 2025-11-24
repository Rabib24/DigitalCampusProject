"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface FinanceProtectedRouteProps {
  children: React.ReactNode;
}

export function FinanceProtectedRoute({ children }: FinanceProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        console.log("Checking finance authorization...");
        const userData = getUserData();
        console.log("User data:", userData);
        
        if (!userData) {
          // No user data, redirect to login
          console.log("No user data found, redirecting to login");
          router.push("/login");
          return;
        }
        
        if (userData.role !== "finance") {
          // User is not a finance admin, redirect to unauthorized page or login
          const errorMsg = "Access denied. You must be a finance administrator to access this page.";
          console.log(errorMsg);
          setError(errorMsg);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
          return;
        }
        
        // User is authorized
        console.log("User is authorized as finance admin");
        setIsAuthorized(true);
        setError(null);
      } catch (err) {
        const errorMsg = "An error occurred while checking authorization. Please try again.";
        console.error("Authorization check error:", err);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authorization Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}