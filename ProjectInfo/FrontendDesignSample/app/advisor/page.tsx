"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AdvisorDashboardView } from "@/components/advisor/views/advisor-dashboard-view"
import { AdviseeListView } from "@/components/advisor/views/advisee-list-view"
import { AppointmentSchedulerView } from "@/components/advisor/views/appointment-scheduler-view"
import { CGPASimulatorView } from "@/components/advisor/views/cgpa-simulator-view"
import { MilestoneRemindersView } from "@/components/advisor/views/milestone-reminders-view"
import { AdvisorSettingsView } from "@/components/advisor/views/advisor-settings-view"

export default function AdvisorPage() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <AdvisorDashboardView />
      case "advisees":
        return <AdviseeListView />
      case "appointments":
        return <AppointmentSchedulerView />
      case "cgpa-simulator":
        return <CGPASimulatorView />
      case "milestones":
        return <MilestoneRemindersView />
      case "settings":
        return <AdvisorSettingsView />
      default:
        return <AdvisorDashboardView />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView} userRole="advisor">
      {renderView()}
    </DashboardLayout>
  )
}
