"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LibraryAnalyticsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Analytics</h2>
        <p className="text-muted-foreground mt-1">Library usage and performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monthly Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">2,847</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 12% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Loan Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">14.2</div>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Popular Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-primary">Computer Science</div>
            <p className="text-xs text-muted-foreground mt-1">42% of loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">98.2%</div>
            <p className="text-xs text-muted-foreground mt-1">On time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Trends</CardTitle>
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
