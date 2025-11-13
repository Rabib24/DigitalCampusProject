"use client"

import { FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MilestoneRemindersView() {
  const milestones = [
    { title: "Thesis Proposal Submission", dueDate: "2024-12-15", status: "pending", students: 8 },
    { title: "Internship Application Deadline", dueDate: "2024-12-31", status: "active", students: 12 },
    { title: "Final Year Project Registration", dueDate: "2024-11-30", status: "pending", students: 15 },
    { title: "Graduation Application", dueDate: "2025-01-15", status: "planning", students: 5 },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Milestone Reminders</h1>
        <p className="text-muted-foreground">Track important academic deadlines</p>
      </div>

      <div className="space-y-3">
        {milestones.map((milestone, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{milestone.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Due: {milestone.dueDate}</p>
                    <p className="text-xs text-muted-foreground mt-2">{milestone.students} advisees affected</p>
                  </div>
                </div>
                <Badge
                  variant={
                    milestone.status === "pending" ? "outline" : milestone.status === "active" ? "default" : "secondary"
                  }
                >
                  {milestone.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
