"use client";

import { useLogout } from "@/lib/logout";

export default function LogoutButton() {
  const { logout } = useLogout();

  return (
    <button
      onClick={logout}
      className="text-sm text-zinc-400 hover:text-white transition-colors"
    >
      Logout
    </button>
  );
}