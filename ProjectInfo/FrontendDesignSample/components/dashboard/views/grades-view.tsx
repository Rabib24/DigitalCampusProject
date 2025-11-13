"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function GradesView() {
  const router = useRouter()

  const courseGrades = [
    { course: "CS-203", grade: "A-", points: 3.7, percentage: 92 },
    { course: "MA-101", grade: "B+", points: 3.3, percentage: 88 },
    { course: "EN-102", grade: "A", points: 4.0, percentage: 95 },
    { course: "PH-203", grade: "B", points: 3.0, percentage: 82 },
    { course: "EC-101", grade: "A-", points: 3.7, percentage: 91 },
  ]

  const chartData = courseGrades.map((course) => ({
    name: course.course,
    grade: course.percentage,
  }))

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600 dark:text-green-400"
    if (grade.startsWith("B")) return "text-blue-600 dark:text-blue-400"
    if (grade.startsWith("C")) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Grades</h2>
        <p className="text-muted-foreground mt-1">Your academic performance this semester</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">3.55</div>
            <p className="text-xs text-muted-foreground mt-2">Based on completed courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Semester GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">3.65</div>
            <p className="text-xs text-muted-foreground mt-2">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500/20 text-green-700 dark:text-green-500">In Good Standing</Badge>
            <p className="text-xs text-muted-foreground mt-2">No academic alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Your grades across courses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="grade" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Course Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Grades</CardTitle>
          <CardDescription>Detailed breakdown of your grades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {courseGrades.map((course, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex-1">
                  <p className="font-semibold">{course.course}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${getGradeColor(course.grade)}`}>{course.grade}</span>
                  <span className="text-sm text-muted-foreground w-12">{course.percentage}%</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${course.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={() => router.push("/student/grades-detail")} className="w-full mt-4">
            View Detailed Grades
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
