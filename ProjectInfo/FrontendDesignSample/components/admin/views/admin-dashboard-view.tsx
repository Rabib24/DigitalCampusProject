"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, BookOpen, Users, DollarSign, Calendar } from "lucide-react"

export function AdminDashboardView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Department Admin Dashboard</h2>
        <p className="text-muted-foreground mt-1">Manage courses, faculty, budget, and departmental operations</p>
      </div>

      {/* Alert Banner */}
      <Alert className="border-accent/50 bg-accent/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Pending Tasks</AlertTitle>
        <AlertDescription>
          3 faculty assignments pending, 5 course approvals waiting, Budget review due in 2 days
        </AlertDescription>
      </Alert>

      {/* Department Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">24</div>
            <p className="text-xs text-muted-foreground mt-1">5 full-time, 19 adjunct</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Courses This Semester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">42</div>
            <p className="text-xs text-muted-foreground mt-1">Across all levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">67%</div>
            <p className="text-xs text-muted-foreground mt-1">$250K of $375K</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Enrollment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">1,247</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 8% from last year</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} />
              Pending Approvals
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <h4 className="font-semibold text-foreground">Faculty Assignment: Data Science</h4>
                  <p className="text-sm text-muted-foreground mt-1">Awaiting approval for Dr. Sarah</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <h4 className="font-semibold text-foreground">New Course Proposal: ML Advanced</h4>
                  <p className="text-sm text-muted-foreground mt-1">Under review by committee</p>
                </div>
                <Badge>Pending</Badge>
              </div>
              <div className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <h4 className="font-semibold text-foreground">Timetable Conflict Resolution</h4>
                  <p className="text-sm text-muted-foreground mt-1">2 courses scheduled at same time</p>
                </div>
                <Badge>Review</Badge>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">View All Pending</Button>
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
              Create Course
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Users size={16} />
              Assign Faculty
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Calendar size={16} />
              Create Timetable
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <DollarSign size={16} />
              Manage Budget
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>Current semester statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-border p-3 hover:bg-accent/5 cursor-pointer transition-colors">
              <h4 className="font-semibold text-sm">Avg Class Size</h4>
              <p className="text-2xl font-bold mt-2 text-primary">29.7</p>
              <p className="text-xs text-muted-foreground mt-1">students per course</p>
            </div>
            <div className="rounded-lg border border-border p-3 hover:bg-accent/5 cursor-pointer transition-colors">
              <h4 className="font-semibold text-sm">Semester Status</h4>
              <p className="text-2xl font-bold mt-2 text-primary">Week 8</p>
              <p className="text-xs text-muted-foreground mt-1">of 16 weeks</p>
            </div>
            <div className="rounded-lg border border-border p-3 hover:bg-accent/5 cursor-pointer transition-colors">
              <h4 className="font-semibold text-sm">Course Utilization</h4>
              <p className="text-2xl font-bold mt-2 text-primary">92%</p>
              <p className="text-xs text-muted-foreground mt-1">rooms booked</p>
            </div>
            <div className="rounded-lg border border-border p-3 hover:bg-accent/5 cursor-pointer transition-colors">
              <h4 className="font-semibold text-sm">Faculty Workload</h4>
              <p className="text-2xl font-bold mt-2 text-primary">4.2</p>
              <p className="text-xs text-muted-foreground mt-1">avg courses taught</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
