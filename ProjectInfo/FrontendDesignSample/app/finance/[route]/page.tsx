"use client"

import { useParams } from "next/navigation"
import InvoiceDetailPage from "@/components/finance/pages/invoice-detail"
import ScholarshipApplicationPage from "@/components/finance/pages/scholarship-application"

export default function FinanceRoutePage() {
  const params = useParams()
  const route = params?.route as string

  const renderPage = () => {
    if (route?.startsWith("invoice-")) {
      const invoiceId = route.replace("invoice-", "")
      return <InvoiceDetailPage invoiceId={invoiceId} />
    }
    if (route === "scholarship-apply") {
      return <ScholarshipApplicationPage />
    }
    return <div>Page not found</div>
  }

  return renderPage()
}
