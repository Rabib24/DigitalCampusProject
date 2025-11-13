"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ResearchAdminDashboardView } from "@/components/research/views/research-admin-dashboard-view"
import { ProjectApprovalView } from "@/components/research/views/project-approval-view"
import { GrantManagementView } from "@/components/research/views/grant-management-view"
import { PublicationManagementView } from "@/components/research/views/publication-management-view"
import { EthicsApprovalView } from "@/components/research/views/ethics-approval-view"
import { ResearchAnalyticsView } from "@/components/research/views/research-analytics-view"
import { ResearchSettingsView } from "@/components/research/views/research-settings-view"

export default function ResearchPage() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <ResearchAdminDashboardView />
      case "approvals":
        return <ProjectApprovalView />
      case "grants":
        return <GrantManagementView />
      case "publications":
        return <PublicationManagementView />
      case "ethics":
        return <EthicsApprovalView />
      case "analytics":
        return <ResearchAnalyticsView />
      case "settings":
        return <ResearchSettingsView />
      default:
        return <ResearchAdminDashboardView />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView} userRole="research">
      {renderView()}
    </DashboardLayout>
  )
}
