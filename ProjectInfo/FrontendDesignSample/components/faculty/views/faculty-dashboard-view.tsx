"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, BookOpen, Users, FileText, Video } from "lucide-react"

export function FacultyDashboardView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome back, Dr. Ahmed!</h2>
        <p className="text-muted-foreground mt-1">Here's your teaching and advising overview</p>
      </div>

      {/* Alert Banner */}
      <Alert className="border-accent/50 bg-accent/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Pending Actions</AlertTitle>
        <AlertDescription>
          You have 12 ungraded assignments and 3 advising appointments scheduled this week.
        </AlertDescription>
      </Alert>

      {/* Teaching Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">4</div>
            <p className="text-xs text-muted-foreground mt-1">245 total students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">12</div>
            <p className="text-xs text-muted-foreground mt-1">Assignments to grade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Advised Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">18</div>
            <p className="text-xs text-muted-foreground mt-1">Active advisees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">89%</div>
            <p className="text-xs text-muted-foreground mt-1">Average across classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Pending Grading
            </CardTitle>
            <CardDescription>Assignments awaiting grades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { course: "CS-301", assignment: "Algorithm Design Project", submissions: 28, daysAgo: 2 },
                { course: "CS-401", assignment: "Capstone Presentation", submissions: 15, daysAgo: 1 },
                { course: "CS-205", assignment: "Quiz 3", submissions: 45, daysAgo: 3 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start justify-between rounded-lg border border-border p-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{item.assignment}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.course} • {item.submissions} submissions
                    </p>
                  </div>
                  <Badge variant="outline">{item.daysAgo}d ago</Badge>
                </div>
              ))}
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">Grade Assignments</Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <BookOpen size={16} />
              Create Assignment
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Users size={16} />
              Schedule Advising
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Video size={16} />
              Start Recording
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Classes Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Classes (This Semester)</CardTitle>
          <CardDescription>You are teaching 4 courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { code: "CS-301", name: "Data Science", students: 32, attendance: 92 },
              { code: "CS-401", name: "Capstone Project", students: 18, attendance: 94 },
              { code: "CS-205", name: "Web Development", students: 45, attendance: 85 },
              { code: "CS-101", name: "Intro to CS", students: 150, attendance: 78 },
            ].map((course) => (
              <div
                key={course.code}
                className="rounded-lg border border-border p-3 hover:bg-accent/5 cursor-pointer transition-colors"
              >
                <h4 className="font-semibold text-sm">{course.code}</h4>
                <p className="text-xs text-muted-foreground mt-1">{course.name}</p>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>{course.students} Students</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${course.attendance}%` }} />
                  </div>
                  <span className="text-muted-foreground">{course.attendance}% Attendance</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
