"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function StudentEnrollmentPage({ courseId }: { courseId: string }) {
  const students = [
    { id: 1, name: "Ahmed Khan", email: "ahmed@iub.edu", status: "Active", grade: "A" },
    { id: 2, name: "Fatima Ali", email: "fatima@iub.edu", status: "Active", grade: "B+" },
    { id: 3, name: "Sara Smith", email: "sara@iub.edu", status: "Active", grade: "A-" },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Student Enrollment</h2>
        <p className="text-muted-foreground mt-1">View and manage enrolled students</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">32</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">30</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">A-</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-3 rounded border border-border hover:bg-accent/5"
            >
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{student.grade}</Badge>
                <Badge variant="outline">{student.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
