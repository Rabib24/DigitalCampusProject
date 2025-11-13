"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FinanceDashboardView } from "@/components/finance/views/finance-dashboard-view"
import { InvoiceManagementView } from "@/components/finance/views/invoice-management-view"
import { PaymentTrackingView } from "@/components/finance/views/payment-tracking-view"
import { ScholarshipManagementView } from "@/components/finance/views/scholarship-management-view"
import { BillingHistoryView } from "@/components/finance/views/billing-history-view"
import { FinanceAnalyticsView } from "@/components/finance/views/finance-analytics-view"
import { FinanceSettingsView } from "@/components/finance/views/finance-settings-view"

export default function FinancePage() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <FinanceDashboardView />
      case "invoices":
        return <InvoiceManagementView />
      case "payments":
        return <PaymentTrackingView />
      case "scholarships":
        return <ScholarshipManagementView />
      case "billing":
        return <BillingHistoryView />
      case "analytics":
        return <FinanceAnalyticsView />
      case "settings":
        return <FinanceSettingsView />
      default:
        return <FinanceDashboardView />
    }
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={setActiveView} userRole="finance">
      {renderView()}
    </DashboardLayout>
  )
}
