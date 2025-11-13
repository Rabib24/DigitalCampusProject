"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Users } from "lucide-react"

export function AssignmentManagementView() {
  const router = useRouter()

  const assignments = [
    {
      id: 1,
      title: "Algorithm Design Project",
      course: "CS-301",
      dueDate: "2024-12-15",
      submissions: 28,
      total: 32,
      status: "Active",
    },
    {
      id: 2,
      title: "Capstone Presentation",
      course: "CS-401",
      dueDate: "2024-12-20",
      submissions: 15,
      total: 18,
      status: "Active",
    },
    {
      id: 3,
      title: "Quiz 3",
      course: "CS-205",
      dueDate: "2024-12-10",
      submissions: 45,
      total: 45,
      status: "Closed",
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Assignment Management</h2>
          <p className="text-muted-foreground mt-1">Create and manage course assignments</p>
        </div>
        <Button
          className="gap-2 bg-primary hover:bg-primary/90"
          onClick={() => router.push(`/faculty/create-assignment-CS-301`)}
        >
          <Plus size={18} />
          Create Assignment
        </Button>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileText size={20} className="text-primary" />
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">{assignment.course}</CardDescription>
                </div>
                <Badge>{assignment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Due: {assignment.dueDate}</span>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span>
                      {assignment.submissions}/{assignment.total} submitted
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => router.push(`/faculty/view-submissions-${assignment.id}`)}
                  >
                    View Submissions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                    onClick={() => router.push(`/faculty/edit-assignment-${assignment.id}`)}
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="bg-transparent">
                    Check Plagiarism
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
