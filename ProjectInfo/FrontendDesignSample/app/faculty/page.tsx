"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FacultyDashboardView } from "@/components/faculty/views/faculty-dashboard-view"
import { FacultyCoursesView } from "@/components/faculty/views/faculty-courses-view"
import { GradebookView } from "@/components/faculty/views/gradebook-view"
import { AssignmentManagementView } from "@/components/faculty/views/assignment-management-view"
import { AdvisingView } from "@/components/faculty/views/advising-view"
import { RecordingsView } from "@/components/faculty/views/recordings-view"
import { ResearchView } from "@/components/faculty/views/research-view"
import { AnalyticsView } from "@/components/faculty/views/analytics-view"
import { FacultySettingsView } from "@/components/faculty/views/faculty-settings-view"

export default function FacultyPage() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <FacultyDashboardView />
      case "courses":
        return <FacultyCoursesView />
      case "gradebook":
        return <GradebookView />
      case "assignments":
        return <AssignmentManagementView />
      case "advising":
        return <AdvisingView />
      case "recordings":
        return <RecordingsView />
      case "research":
        return <ResearchView />
      case "analytics":
        return <AnalyticsView />
      case "settings":
        return <FacultySettingsView />
      default:
        return <FacultyDashboardView />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView} userRole="faculty">
      {renderView()}
    </DashboardLayout>
  )
}
