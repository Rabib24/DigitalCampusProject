"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, BookOpen, Clock, FileText } from "lucide-react"

export function DashboardView() {
  const router = useRouter()

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome back, Student!</h2>
        <p className="text-muted-foreground mt-1">Here's your academic overview</p>
      </div>

      {/* Alert Banner */}
      <Alert className="border-accent/50 bg-accent/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Reminder</AlertTitle>
        <AlertDescription>Your CGPA is 3.45. You have 2 pending assignments due this week.</AlertDescription>
      </Alert>

      {/* Academic Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">3.45</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 0.05 from last semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground mt-1">12 remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Predicted Graduation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Dec 2025</div>
            <p className="text-xs text-muted-foreground mt-1">On track</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Upcoming */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Next Assignment */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Next Assignment
            </CardTitle>
            <CardDescription>Due soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <h4 className="font-semibold text-foreground">Data Structures Project</h4>
                  <p className="text-sm text-muted-foreground mt-1">CS-203 • Due in 2 days</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <h4 className="font-semibold text-foreground">Essay: Global Economics</h4>
                  <p className="text-sm text-muted-foreground mt-1">EC-101 • Due in 5 days</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => {
                const event = new CustomEvent("viewChange", { detail: "assignments" })
                window.dispatchEvent(event)
              }}
            >
              View All Assignments
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Clock size={16} />
              Class Schedule
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <BookOpen size={16} />
              Course Materials
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <AlertCircle size={16} />
              Emergency Contacts
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses (This Semester)</CardTitle>
          <CardDescription>You are enrolled in 5 courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {[
              { id: 1, code: "CS-203", name: "Data Structures", progress: 85 },
              { id: 2, code: "MA-101", name: "Calculus I", progress: 78 },
              { id: 3, code: "EN-102", name: "English Literature", progress: 90 },
              { id: 4, code: "PH-203", name: "Physics II", progress: 72 },
              { id: 5, code: "EC-101", name: "Economics", progress: 88 },
            ].map((course) => (
              <div
                key={course.code}
                className="rounded-lg border border-border p-3 hover:bg-accent/5 cursor-pointer transition-colors"
                onClick={() => router.push(`/student/course-${course.id}`)}
              >
                <h4 className="font-semibold text-sm">{course.code}</h4>
                <p className="text-xs text-muted-foreground mt-1">{course.name}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
