"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface GradebookDetailPageProps {
  courseId: string
}

export function GradebookDetailPage({ courseId }: GradebookDetailPageProps) {
  const router = useRouter()

  const gradesData = [
    { range: "A (90-100)", count: 8, color: "hsl(var(--chart-1))" },
    { range: "B (80-89)", count: 12, color: "hsl(var(--chart-2))" },
    { range: "C (70-79)", count: 7, color: "hsl(var(--chart-3))" },
    { range: "D (60-69)", count: 3, color: "hsl(var(--chart-4))" },
    { range: "F (Below 60)", count: 2, color: "hsl(var(--chart-5))" },
  ]

  const studentGrades = [
    {
      name: "Ahmed Ali",
      id: "SE2021001",
      quiz1: 85,
      quiz2: 90,
      assignment1: 88,
      midterm: 92,
      assignment2: 95,
      final: 90,
      total: 90,
    },
    {
      name: "Fatima Khan",
      id: "SE2021002",
      quiz1: 78,
      quiz2: 82,
      assignment1: 85,
      midterm: 88,
      assignment2: 90,
      final: 85,
      total: 85,
    },
    {
      name: "Hassan Malik",
      id: "SE2021003",
      quiz1: 88,
      quiz2: 92,
      assignment1: 90,
      midterm: 95,
      assignment2: 92,
      final: 93,
      total: 92,
    },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gradebook</h1>
        <p className="text-muted-foreground">Course ID: {courseId}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Overall grade distribution in the course</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: {
                label: "Students",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
          <CardDescription>Detailed grades for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Student</th>
                  <th className="text-center p-2 font-medium">Quiz 1</th>
                  <th className="text-center p-2 font-medium">Quiz 2</th>
                  <th className="text-center p-2 font-medium">Assign 1</th>
                  <th className="text-center p-2 font-medium">Midterm</th>
                  <th className="text-center p-2 font-medium">Assign 2</th>
                  <th className="text-center p-2 font-medium">Final</th>
                  <th className="text-center p-2 font-medium font-bold">Total</th>
                  <th className="text-right p-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-accent/5 transition-colors">
                    <td className="p-2 font-medium">
                      <div>
                        <p>{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.id}</p>
                      </div>
                    </td>
                    <td className="text-center p-2">{student.quiz1}</td>
                    <td className="text-center p-2">{student.quiz2}</td>
                    <td className="text-center p-2">{student.assignment1}</td>
                    <td className="text-center p-2">{student.midterm}</td>
                    <td className="text-center p-2">{student.assignment2}</td>
                    <td className="text-center p-2">{student.final}</td>
                    <td className="text-center p-2 font-bold">{student.total}</td>
                    <td className="text-right p-2">
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

      <Card>
        <CardHeader>
          <CardTitle>Class Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg text-center">
            <p className="text-2xl font-bold">87.5</p>
            <p className="text-xs text-muted-foreground mt-1">Class Average</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <p className="text-2xl font-bold">95</p>
            <p className="text-xs text-muted-foreground mt-1">Highest Score</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <p className="text-2xl font-bold">60</p>
            <p className="text-xs text-muted-foreground mt-1">Lowest Score</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <p className="text-2xl font-bold">32</p>
            <p className="text-xs text-muted-foreground mt-1">Total Students</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
