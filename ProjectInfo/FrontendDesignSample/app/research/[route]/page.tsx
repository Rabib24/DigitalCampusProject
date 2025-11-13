"use client"

import { useParams } from "next/navigation"
import ProjectDetailPage from "@/components/research/pages/project-detail"
import GrantApplicationPage from "@/components/research/pages/grant-application"

export default function ResearchRoutePage() {
  const params = useParams()
  const route = params?.route as string

  const renderPage = () => {
    if (route?.startsWith("project-")) {
      const projectId = route.replace("project-", "")
      return <ProjectDetailPage projectId={projectId} />
    }
    if (route === "grant-apply") {
      return <GrantApplicationPage />
    }
    return <div>Page not found</div>
  }

  return renderPage()
}
