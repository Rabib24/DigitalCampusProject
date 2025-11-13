"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function GradesDetailPage() {
  const router = useRouter()

  const gradeData = [
    { assignment: "Quiz 1", grade: 85, maxPoints: 100 },
    { assignment: "Quiz 2", grade: 90, maxPoints: 100 },
    { assignment: "Assignment 1", grade: 88, maxPoints: 100 },
    { assignment: "Midterm", grade: 92, maxPoints: 100 },
    { assignment: "Assignment 2", grade: 95, maxPoints: 100 },
    { assignment: "Project", grade: 92, maxPoints: 100 },
  ]

  const courseGrades = [
    { course: "CS-203", grade: 90, credits: 3 },
    { course: "MA-101", grade: 87, credits: 4 },
    { course: "EN-102", grade: 92, credits: 3 },
    { course: "PH-203", grade: 85, credits: 4 },
    { course: "EC-101", grade: 89, credits: 3 },
  ]

  const cumulativeGPA = 3.78
  const currentGPA = 3.85

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Grades</h1>
        <p className="text-muted-foreground">Fall 2024 Semester</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Current GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-bold text-3xl">{currentGPA}</span>
            <p className="text-sm text-muted-foreground mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cumulative GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-bold text-3xl">{cumulativeGPA}</span>
            <p className="text-sm text-muted-foreground mt-1">All semesters</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Grades</CardTitle>
          <CardDescription>Your grades across all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courseGrades.map((item) => (
              <div key={item.course} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.course}</p>
                  <p className="text-sm text-muted-foreground">{item.credits} Credits</p>
                </div>
                <div className="text-right">
                  <Badge className="mb-1">{item.grade}</Badge>
                  <div className="w-20 h-2 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${item.grade}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Your performance across assignments and assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              grade: {
                label: "Grade",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="assignment" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="grade" fill="var(--color-grade)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
