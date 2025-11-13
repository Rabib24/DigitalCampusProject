"use client"

import type React from "react"
import { Bell, LogOut, Menu, X, LogIn } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SideNav } from "./side-nav"
import { NotificationCenter } from "@/components/notifications/notification-center"

export function DashboardLayout({
  children,
  activeView,
  onViewChange,
  userRole = "student",
}: {
  children: React.ReactNode
  activeView: string
  onViewChange: (view: string) => void
  userRole?: "student" | "faculty" | "admin" | "library" | "it-admin" | "advisor" | "finance" | "research"
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const getRoleTitle = () => {
    switch (userRole) {
      case "faculty":
        return "Faculty Portal"
      case "admin":
        return "Department Admin"
      case "library":
        return "Library Staff"
      case "it-admin":
        return "IT Administration"
      case "advisor":
        return "Academic Advisor"
      case "finance":
        return "Finance Administration"
      case "research":
        return "Research Administration"
      default:
        return "IUB Campus"
    }
  }

  const handleSwitchRole = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-primary md:text-2xl">{getRoleTitle()}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationOpen(true)}>
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} />
                    <AvatarFallback>{userRole?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>My IUBian Card</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSwitchRole} className="gap-2">
                  <LogIn size={16} />
                  Switch Role
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-destructive">
                  <LogOut size={16} />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <div className="flex gap-0 md:gap-4 p-0 md:p-4">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} w-full md:block md:w-64 flex-shrink-0`}>
          <SideNav activeView={activeView} onViewChange={onViewChange} userRole={userRole} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)]">{children}</main>
      </div>

      {/* NotificationCenter modal */}
      <NotificationCenter isOpen={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </div>
  )
}
