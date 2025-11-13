"use client"

import { CheckCircle, X, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ProjectApprovalView() {
  const projects = [
    { id: 1, title: "AI in Healthcare", pi: "Dr. Fatima Khan", status: "pending-review", budget: "PKR 5M" },
    { id: 2, title: "Climate Change Analysis", pi: "Dr. Ali Hassan", status: "approved", budget: "PKR 8M" },
    { id: 3, title: "Blockchain Applications", pi: "Dr. Sara Ahmed", status: "pending-ethics", budget: "PKR 6M" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Project Approvals</h1>
        <p className="text-muted-foreground">Review and approve research projects</p>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.pi}</p>
                  </div>
                </div>
                <Badge
                  variant={
                    project.status === "approved"
                      ? "default"
                      : project.status === "pending-review"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {project.status}
                </Badge>
              </div>
              <p className="text-sm mb-4">Budget: {project.budget}</p>
              <div className="flex gap-2">
                <Button size="sm" className="gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button size="sm" variant="ghost">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
