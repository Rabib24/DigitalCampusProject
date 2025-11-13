"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ITDashboardView } from "@/components/it-admin/views/it-dashboard-view"
import { UserManagementView } from "@/components/it-admin/views/user-management-view"
import { SecurityManagementView } from "@/components/it-admin/views/security-management-view"
import { SystemHealthView } from "@/components/it-admin/views/system-health-view"
import { BackupRecoveryView } from "@/components/it-admin/views/backup-recovery-view"
import { LogsAnalyticsView } from "@/components/it-admin/views/logs-analytics-view"
import { IntegrationManagementView } from "@/components/it-admin/views/integration-management-view"
import { ITSettingsView } from "@/components/it-admin/views/it-settings-view"

export default function ITAdminPage() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <ITDashboardView />
      case "users":
        return <UserManagementView />
      case "security":
        return <SecurityManagementView />
      case "health":
        return <SystemHealthView />
      case "backup":
        return <BackupRecoveryView />
      case "logs":
        return <LogsAnalyticsView />
      case "integrations":
        return <IntegrationManagementView />
      case "settings":
        return <ITSettingsView />
      default:
        return <ITDashboardView />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView} userRole="it-admin">
      {renderView()}
    </DashboardLayout>
  )
}
