"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function GradebookView() {
  const router = useRouter()

  const gradebookData = [
    { studentId: "S001", name: "Ali Ahmed", assignment1: 92, assignment2: 88, midterm: 85, final: null },
    { studentId: "S002", name: "Fatima Khan", assignment1: 95, assignment2: 92, midterm: 90, final: null },
    { studentId: "S003", name: "Hassan Ali", assignment1: 78, assignment2: 82, midterm: 75, final: null },
    { studentId: "S004", name: "Aisha Malik", assignment1: 88, assignment2: 90, midterm: 92, final: null },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Gradebook</h2>
        <p className="text-muted-foreground mt-1">Manage student grades and submissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>CS-301: Data Science</CardTitle>
              <CardDescription>32 students enrolled</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => router.push(`/faculty/gradebook-CS-301`)}>
                View Full Gradebook
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Submit Grades
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-semibold p-2">Student</th>
                  <th className="text-center font-semibold p-2">Assignment 1</th>
                  <th className="text-center font-semibold p-2">Assignment 2</th>
                  <th className="text-center font-semibold p-2">Midterm</th>
                  <th className="text-center font-semibold p-2">Final</th>
                  <th className="text-center font-semibold p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gradebookData.map((row) => (
                  <tr key={row.studentId} className="border-b border-border hover:bg-accent/5">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-xs text-muted-foreground">{row.studentId}</p>
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline">{row.assignment1}</Badge>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline">{row.assignment2}</Badge>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline">{row.midterm}</Badge>
                    </td>
                    <td className="text-center p-2">
                      {row.final ? (
                        <Badge variant="outline">{row.final}</Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </td>
                    <td className="text-center p-2">
                      <Button size="sm" variant="ghost">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
