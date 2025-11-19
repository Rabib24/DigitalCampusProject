"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/lib/auth";
import { useLogout } from "@/lib/logout";

export function FacultyTopNav() {
  const [user, setUser] = useState<{ first_name: string; last_name: string } | null>(null);
  const router = useRouter();
  const { logout } = useLogout();

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser({
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">DC</span>
          </div>
          <span className="font-semibold">Digital Campus</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center">
              <span className="text-xs font-medium">
                {user ? user.first_name.charAt(0) + user.last_name.charAt(0) : "F"}
              </span>
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-medium">
                {user ? `${user.first_name} ${user.last_name}` : "Faculty"}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}