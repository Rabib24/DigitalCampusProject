"use client"

import { Filter, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function AdviseeListView() {
  const router = useRouter()

  const advisees = [
    { id: "STU001", name: "Ahmed Hassan", cgpa: 3.5, status: "good", completedCredits: 60 },
    { id: "STU002", name: "Sarah Khan", cgpa: 2.8, status: "warning", completedCredits: 45 },
    { id: "STU003", name: "Maria Santos", cgpa: 3.2, status: "good", completedCredits: 72 },
    { id: "STU004", name: "John Doe", cgpa: 1.8, status: "critical", completedCredits: 30 },
    { id: "STU005", name: "Emma Wilson", cgpa: 3.7, status: "excellent", completedCredits: 90 },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Advisees</h1>
          <p className="text-muted-foreground">Total: {advisees.length} students</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 flex-col md:flex-row">
        <Input placeholder="Search by name or ID..." className="md:w-64" />
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Advisees Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {advisees.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => router.push(`/advisor/advisee-${student.id}`)}
              >
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">CGPA: {student.cgpa}</p>
                  <p className="text-xs text-muted-foreground">Credits: {student.completedCredits}</p>
                </div>
                <Badge
                  variant={
                    student.status === "excellent"
                      ? "default"
                      : student.status === "good"
                        ? "secondary"
                        : student.status === "warning"
                          ? "outline"
                          : "destructive"
                  }
                  className="ml-4"
                >
                  {student.status === "critical" ? (
                    <AlertCircle className="h-3 w-3 mr-1" />
                  ) : student.status === "excellent" ? (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  ) : null}
                  {student.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
