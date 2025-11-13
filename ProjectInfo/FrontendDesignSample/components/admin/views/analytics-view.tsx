"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, BookOpen, DollarSign } from "lucide-react"

export function AnalyticsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Analytics Dashboard</h2>
        <p className="text-muted-foreground mt-1">Department performance metrics and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">↑ 12%</div>
            <p className="text-xs text-muted-foreground mt-1">vs last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users size={16} className="text-primary" />
              Faculty Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">4.2/5</div>
            <p className="text-xs text-muted-foreground mt-1">Based on survey</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen size={16} className="text-purple-500" />
              Course Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">91%</div>
            <p className="text-xs text-muted-foreground mt-1">Pass rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign size={16} className="text-orange-500" />
              Budget Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">94%</div>
            <p className="text-xs text-muted-foreground mt-1">Optimally allocated</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Trends</CardTitle>
          <CardDescription>Last 6 semesters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
            Chart visualization would appear here
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
