"use client"

import { BookOpen, AlertCircle, Zap, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ResearchAdminDashboardView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Research Administration</h1>
        <p className="text-muted-foreground mt-2">Manage research projects and grants</p>
      </div>

      {/* Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>12 project proposals pending ethics review</AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Ongoing research</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Grants Awarded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR 2.3B</div>
            <p className="text-xs text-green-600">+5% this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
            <p className="text-xs text-destructive">Ethics approvals</p>
          </CardContent>
        </Card>
      </div>

      {/* Project Status */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Proposals</CardTitle>
          <CardDescription>Projects awaiting approval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: "AI in Healthcare", pi: "Dr. Fatima Khan", status: "pending-ethics", budget: "PKR 5M" },
            { title: "Climate Change Analysis", pi: "Dr. Ali Hassan", status: "approved", budget: "PKR 8M" },
            { title: "Blockchain Applications", pi: "Dr. Sara Ahmed", status: "under-review", budget: "PKR 6M" },
          ].map((project, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{project.title}</p>
                <p className="text-sm text-muted-foreground">PI: {project.pi}</p>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    project.status === "approved"
                      ? "default"
                      : project.status === "under-review"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button className="gap-2">
          <BookOpen className="h-4 w-4" />
          Review Proposals
        </Button>
        <Button className="gap-2 bg-transparent" variant="outline">
          <Zap className="h-4 w-4" />
          Manage Grants
        </Button>
        <Button className="gap-2 bg-transparent" variant="outline">
          <FileText className="h-4 w-4" />
          View Publications
        </Button>
      </div>
    </div>
  )
}
