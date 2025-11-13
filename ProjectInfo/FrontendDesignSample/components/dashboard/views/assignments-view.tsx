"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Upload } from "lucide-react"

export function AssignmentsView() {
  const router = useRouter()

  const assignments = [
    {
      id: 1,
      title: "Data Structures Project - Binary Tree",
      course: "CS-203",
      dueDate: "2025-12-20",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Essay: Global Economics Impact",
      course: "EC-101",
      dueDate: "2025-12-23",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      title: "Calculus Problem Set 5",
      course: "MA-101",
      dueDate: "2025-12-25",
      status: "submitted",
      priority: "low",
    },
    {
      id: 4,
      title: "Literature Analysis - Shakespeare",
      course: "EN-102",
      dueDate: "2025-12-22",
      status: "pending",
      priority: "medium",
    },
    {
      id: 5,
      title: "Physics Lab Report - Thermodynamics",
      course: "PH-203",
      dueDate: "2025-12-21",
      status: "submitted",
      priority: "low",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive"
      case "medium":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-500"
      default:
        return "bg-green-500/20 text-green-700 dark:text-green-500"
    }
  }

  const getStatusBadge = (status: string) => {
    return status === "submitted"
      ? "bg-green-500/20 text-green-700 dark:text-green-500"
      : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-500"
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Assignments</h2>
        <p className="text-muted-foreground mt-1">Track your pending and submitted assignments</p>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription className="mt-1">{assignment.course}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(assignment.priority)}>
                    {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                  </Badge>
                  <Badge className={getStatusBadge(assignment.status)}>
                    {assignment.status === "submitted" ? "Submitted" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2">
                {assignment.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="gap-2 bg-primary hover:bg-primary/90"
                      onClick={() => router.push(`/student/submit-assignment-${assignment.id}`)}
                    >
                      <Upload size={16} />
                      Submit Assignment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/student/assignment-detail-${assignment.id}`)}
                    >
                      View Details
                    </Button>
                  </>
                )}
                {assignment.status === "submitted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/student/assignment-detail-${assignment.id}`)}
                  >
                    View Submission
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
