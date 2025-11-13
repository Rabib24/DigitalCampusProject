"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdminDashboardView } from "@/components/admin/views/admin-dashboard-view"
import { CourseManagementView } from "@/components/admin/views/course-management-view"
import { TimetableManagementView } from "@/components/admin/views/timetable-management-view"
import { BudgetManagementView } from "@/components/admin/views/budget-management-view"
import { FacultyManagementView } from "@/components/admin/views/faculty-management-view"
import { StudentManagementView } from "@/components/admin/views/student-management-view"
import { StaffRequestsView } from "@/components/admin/views/staff-requests-view"
import { AnalyticsView as AdminAnalyticsView } from "@/components/admin/views/analytics-view"
import { AdminSettingsView } from "@/components/admin/views/admin-settings-view"

export default function AdminPage() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <AdminDashboardView />
      case "courses":
        return <CourseManagementView />
      case "timetable":
        return <TimetableManagementView />
      case "budget":
        return <BudgetManagementView />
      case "faculty":
        return <FacultyManagementView />
      case "students":
        return <StudentManagementView />
      case "requests":
        return <StaffRequestsView />
      case "analytics":
        return <AdminAnalyticsView />
      case "settings":
        return <AdminSettingsView />
      default:
        return <AdminDashboardView />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView} userRole="admin">
      {renderView()}
    </DashboardLayout>
  )
}
