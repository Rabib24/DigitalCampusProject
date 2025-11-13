"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardView } from "@/components/dashboard/views/dashboard-view"
import { CoursesView } from "@/components/dashboard/views/courses-view"
import { AssignmentsView } from "@/components/dashboard/views/assignments-view"
import { GradesView } from "@/components/dashboard/views/grades-view"
import { LibraryView } from "@/components/dashboard/views/library-view"
import { CalendarView } from "@/components/dashboard/views/calendar-view"
import { MessagesView } from "@/components/dashboard/views/messages-view"
import { SettingsView } from "@/components/dashboard/views/settings-view"
import { RoleSwitcher } from "@/components/role-switcher"

export default function Page() {
  const [activeView, setActiveView] = useState<string | "role-selector">("role-selector")
  const [userRole, setUserRole] = useState<
    "student" | "faculty" | "admin" | "library" | "it-admin" | "advisor" | "finance" | "research" | null
  >(null)
  const router = useRouter()

  if (activeView === "role-selector" || !userRole) {
    return (
      <RoleSwitcher
        onSelectRole={(role) => {
          setUserRole(role)
          setActiveView("dashboard")
          if (role !== "student") {
            const roleMap: Record<string, string> = {
              faculty: "/faculty",
              advisor: "/advisor",
              admin: "/admin",
              finance: "/finance",
              library: "/library",
              research: "/research",
              "it-admin": "/it-admin",
            }
            router.push(roleMap[role] || "/")
          }
        }}
        onLogout={() => {
          setUserRole(null)
          setActiveView("role-selector")
        }}
      />
    )
  }

  const renderStudentView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />
      case "courses":
        return <CoursesView />
      case "assignments":
        return <AssignmentsView />
      case "grades":
        return <GradesView />
      case "library":
        return <LibraryView />
      case "calendar":
        return <CalendarView />
      case "messages":
        return <MessagesView />
      case "settings":
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView} userRole={userRole}>
      {renderStudentView()}
    </DashboardLayout>
  )
}
