"use client"

import { useParams } from "next/navigation"
import AdviseeProgressTrackingPage from "@/components/advisor/pages/advisee-progress-tracking"
import AdviseeDetailPage from "@/components/advisor/pages/advisee-detail"

export default function AdvisorRoutePage() {
  const params = useParams()
  const route = params?.route as string

  const renderPage = () => {
    if (route?.startsWith("advisee-")) {
      const adviseeId = route.replace("advisee-", "")
      return <AdviseeDetailPage adviseeId={adviseeId} />
    }
    if (route === "advisee-progress") {
      return <AdviseeProgressTrackingPage />
    }
    return <div>Page not found</div>
  }

  return renderPage()
}
