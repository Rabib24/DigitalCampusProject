"use client";

import { useLogout } from "@/lib/logout";

interface FacultyLogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function FacultyLogoutButton({ className = "", children }: FacultyLogoutButtonProps) {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
    >
      {children || "Logout"}
    </button>
  );
}