"use client"

import { ArrowLeft, FileText, Calendar, DollarSign, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function ProjectDetailPage({ projectId }: { projectId: string }) {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">AI in Healthcare</h1>
        <p className="text-muted-foreground">Research Project</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 items-center">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Principal Investigator</p>
                <p className="font-medium">Dr. Fatima Khan</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="font-medium">PKR 5M</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">24 months</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="default" className="text-base px-3 py-1">
              Approved
            </Badge>
            <p className="text-sm text-muted-foreground">Project is active and proceeding on schedule</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            This research project focuses on applying artificial intelligence techniques to healthcare diagnosis and
            treatment planning. The project aims to develop machine learning models for early disease detection.
          </p>
        </CardContent>
      </Card>

      <Button className="gap-2">
        <FileText className="h-4 w-4" />
        View Full Report
      </Button>
    </div>
  )
}
