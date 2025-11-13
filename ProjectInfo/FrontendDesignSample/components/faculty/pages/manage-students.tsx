"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Mail, Download } from "lucide-react"

interface ManageStudentsPageProps {
  courseId: string
}

export function ManageStudentsPage({ courseId }: ManageStudentsPageProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const students = [
    { id: 1, name: "Ahmed Ali", email: "ahmed@iub.edu.pk", studentId: "SE2021001", status: "Active", grade: "A" },
    { id: 2, name: "Fatima Khan", email: "fatima@iub.edu.pk", studentId: "SE2021002", status: "Active", grade: "B+" },
    { id: 3, name: "Hassan Malik", email: "hassan@iub.edu.pk", studentId: "SE2021003", status: "Active", grade: "A-" },
    { id: 4, name: "Aisha Patel", email: "aisha@iub.edu.pk", studentId: "SE2021004", status: "Dropped", grade: "-" },
    { id: 5, name: "Muhammad Saeed", email: "saeed@iub.edu.pk", studentId: "SE2021005", status: "Active", grade: "B" },
  ]

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.includes(searchTerm),
  )

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Students</h1>
        <p className="text-muted-foreground">
          Course ID: {courseId} • {students.length} students enrolled
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>View and manage enrolled students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download size={16} />
              Export
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Student Name</th>
                  <th className="text-left p-2 font-medium">Student ID</th>
                  <th className="text-left p-2 font-medium">Email</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Current Grade</th>
                  <th className="text-right p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-accent/5 transition-colors">
                    <td className="p-2 font-medium">{student.name}</td>
                    <td className="p-2">{student.studentId}</td>
                    <td className="p-2">
                      <Button variant="link" size="sm" className="gap-1 h-auto p-0">
                        <Mail size={14} />
                        {student.email}
                      </Button>
                    </td>
                    <td className="p-2">
                      <Badge variant={student.status === "Active" ? "default" : "outline"}>{student.status}</Badge>
                    </td>
                    <td className="p-2">{student.grade}</td>
                    <td className="p-2 text-right">
                      <Button variant="ghost" size="sm">
                        View Progress
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline">Send Message to All</Button>
            <Button variant="outline">Export Grades</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
