"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function StudentManagementView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Student Management</h2>
        <p className="text-muted-foreground mt-1">Monitor student enrollments and progress</p>
      </div>

      {/* Student Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">1,247</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 8% from last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">New Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">89</div>
            <p className="text-xs text-muted-foreground mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">34</div>
            <p className="text-xs text-muted-foreground mt-1">CGPA {"<"} 2.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Graduation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">87%</div>
            <p className="text-xs text-muted-foreground mt-1">4-year cohort</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Overview by Level */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment by Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { level: "Freshman", count: 320, percentage: 26 },
            { level: "Sophomore", count: 310, percentage: 25 },
            { level: "Junior", count: 318, percentage: 25 },
            { level: "Senior", count: 299, percentage: 24 },
          ].map((item) => (
            <div key={item.level} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.level}</span>
                <Badge variant="outline">{item.count} students</Badge>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
