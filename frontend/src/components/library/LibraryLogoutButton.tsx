"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { clearAuthData } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function LibraryLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear authentication data from localStorage
      clearAuthData();
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden md:inline">Logout</span>
    </Button>
  );
}