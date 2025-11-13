"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserDetailPage } from "@/components/it-admin/pages/user-detail"
import { SecurityIncidentPage } from "@/components/it-admin/pages/security-incident"
import { ServerDetailPage } from "@/components/it-admin/pages/server-detail"
import { BackupDetailPage } from "@/components/it-admin/pages/backup-detail"

export default function ITAdminDetailPage() {
  const router = useRouter()
  const params = useParams()
  const route = params.route as string

  const renderPage = () => {
    switch (true) {
      case route.startsWith("user-"):
        return <UserDetailPage userId={route.split("-").pop() || ""} />
      case route.startsWith("incident-"):
        return <SecurityIncidentPage incidentId={route.split("-").pop() || ""} />
      case route.startsWith("server-"):
        return <ServerDetailPage serverId={route.split("-").pop() || ""} />
      case route.startsWith("backup-"):
        return <BackupDetailPage backupId={route.split("-").pop() || ""} />
      default:
        return <div className="p-6">Page not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="p-4 md:p-6">
        <Button variant="outline" size="sm" className="gap-2 mb-6 bg-transparent" onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Back
        </Button>
        {renderPage()}
      </div>
    </div>
  )
}
