"use client"

import { AlertCircle, Calendar, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AdvisorDashboardView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Academic Advisor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Monitor and support your advisees</p>
      </div>

      {/* Alert Banner */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>3 advisees need attention: GPA below threshold</AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Advisees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interventions Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Low GPA alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Graduation Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-xs text-muted-foreground">Next semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Advisees */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Urgent Cases</CardTitle>
              <CardDescription>Advisees requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "Ahmed Hassan",
                  id: "STU001",
                  cgpa: 1.8,
                  status: "warning",
                },
                {
                  name: "Sarah Khan",
                  id: "STU002",
                  cgpa: 1.5,
                  status: "danger",
                },
                {
                  name: "Maria Santos",
                  id: "STU003",
                  cgpa: 1.9,
                  status: "warning",
                },
              ].map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={student.status === "danger" ? "destructive" : "secondary"}>
                      CGPA: {student.cgpa}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Next Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { time: "Today, 2:00 PM", student: "John Doe" },
              { time: "Tomorrow, 10:00 AM", student: "Emma Wilson" },
              { time: "Wed, 3:30 PM", student: "Ali Ahmed" },
            ].map((meeting, idx) => (
              <div key={idx} className="flex gap-3 pb-3 border-b last:border-0">
                <Calendar className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{meeting.student}</p>
                  <p className="text-xs text-muted-foreground">{meeting.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button className="gap-2">
          <Users className="h-4 w-4" />
          View All Advisees
        </Button>
        <Button className="gap-2 bg-transparent" variant="outline">
          <Calendar className="h-4 w-4" />
          Schedule Meeting
        </Button>
        <Button className="gap-2 bg-transparent" variant="outline">
          <TrendingUp className="h-4 w-4" />
          CGPA Simulator
        </Button>
      </div>
    </div>
  )
}
