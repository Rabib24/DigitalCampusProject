"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LibraryDashboardView } from "@/components/library/views/library-dashboard-view"
import { BookCatalogView } from "@/components/library/views/book-catalog-view"
import { LoanManagementView } from "@/components/library/views/loan-management-view"
import { PatronManagementView } from "@/components/library/views/patron-management-view"
import { DigitalResourcesView } from "@/components/library/views/digital-resources-view"
import { OverdueItemsView } from "@/components/library/views/overdue-items-view"
import { LibraryAnalyticsView } from "@/components/library/views/analytics-view"
import { LibrarySettingsView } from "@/components/library/views/library-settings-view"

export default function LibraryPage() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <LibraryDashboardView />
      case "catalog":
        return <BookCatalogView />
      case "loans":
        return <LoanManagementView />
      case "patrons":
        return <PatronManagementView />
      case "digital":
        return <DigitalResourcesView />
      case "overdue":
        return <OverdueItemsView />
      case "analytics":
        return <LibraryAnalyticsView />
      case "settings":
        return <LibrarySettingsView />
      default:
        return <LibraryDashboardView />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView} userRole="library">
      {renderView()}
    </DashboardLayout>
  )
}
