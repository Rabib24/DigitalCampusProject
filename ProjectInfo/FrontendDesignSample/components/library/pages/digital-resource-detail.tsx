"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DigitalResourceDetailPage({ resourceId }: { resourceId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Digital Resource Details</h2>
        <p className="text-muted-foreground mt-1">Manage digital collection access and subscriptions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resource Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">IEEE Digital Library</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">Journal Database</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subscription Status</p>
              <Badge className="mt-1">Active</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Renewal Date</p>
              <p className="font-medium">December 31, 2025</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Access Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Monthly Accesses</p>
              <p className="text-2xl font-bold mt-1">2,450</p>
            </div>
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold mt-1">1,245</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
