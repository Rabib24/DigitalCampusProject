"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Download, Eye, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface ViewSubmissionsPageProps {
  assignmentId: string
}

export function ViewSubmissionsPage({ assignmentId }: ViewSubmissionsPageProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const submissions = [
    {
      id: 1,
      studentName: "Ahmed Ali",
      studentId: "SE2021001",
      submittedAt: "2024-10-14 22:30",
      status: "Graded",
      grade: 92,
    },
    {
      id: 2,
      studentName: "Fatima Khan",
      studentId: "SE2021002",
      submittedAt: "2024-10-15 15:45",
      status: "Pending",
      grade: null,
    },
    {
      id: 3,
      studentName: "Hassan Malik",
      studentId: "SE2021003",
      submittedAt: "2024-10-16 02:15",
      status: "Late",
      grade: null,
    },
    {
      id: 4,
      studentName: "Aisha Patel",
      studentId: "SE2021004",
      submittedAt: "",
      status: "Not Submitted",
      grade: null,
    },
    {
      id: 5,
      studentName: "Muhammad Saeed",
      studentId: "SE2021005",
      submittedAt: "2024-10-14 10:20",
      status: "Graded",
      grade: 88,
    },
  ]

  const filteredSubmissions = submissions.filter(
    (s) => s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || s.studentId.includes(searchTerm),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Graded":
        return <CheckCircle size={16} className="text-green-600" />
      case "Pending":
        return <Clock size={16} className="text-blue-600" />
      case "Late":
        return <AlertCircle size={16} className="text-orange-600" />
      default:
        return <AlertCircle size={16} className="text-red-600" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">View Submissions</h1>
        <p className="text-muted-foreground">Assignment ID: {assignmentId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission List</CardTitle>
          <CardDescription>View and grade student submissions</CardDescription>
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
                  <th className="text-left p-2 font-medium">Submitted At</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Grade</th>
                  <th className="text-right p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b hover:bg-accent/5 transition-colors">
                    <td className="p-2 font-medium">{submission.studentName}</td>
                    <td className="p-2">{submission.studentId}</td>
                    <td className="p-2 text-muted-foreground">{submission.submittedAt || "-"}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission.status)}
                        <Badge
                          variant={
                            submission.status === "Graded"
                              ? "default"
                              : submission.status === "Late"
                                ? "secondary"
                                : submission.status === "Pending"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-2 font-medium">{submission.grade ? `${submission.grade}/100` : "-"}</td>
                    <td className="p-2 text-right flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" className="gap-1">
                        <Eye size={14} />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="gap-1">
                        <MessageSquare size={14} />
                        Grade
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4 flex gap-2 justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredSubmissions.length} of {submissions.length} submissions
            </div>
            <Button variant="outline">Download All Submissions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
