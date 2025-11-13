"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ResearchAnalyticsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold">Research Analytics</h1>
        <p className="text-muted-foreground">Research performance and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Publication Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">2024: 42 publications</p>
              <p className="text-sm">2023: 38 publications</p>
              <p className="text-sm text-green-600">+10.5% growth</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citation Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">Average Citations/Paper: 15.2</p>
              <p className="text-sm">H-Index: 28</p>
              <p className="text-sm text-green-600">Top 10% in field</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
