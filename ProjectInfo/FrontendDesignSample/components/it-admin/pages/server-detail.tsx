"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ServerDetailPage({ serverId }: { serverId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Server Details</h2>
        <p className="text-muted-foreground mt-1">Monitor server health and performance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Server Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Server Name</p>
              <p className="font-medium">Web Server 1</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">IP Address</p>
              <p className="font-medium">192.168.1.100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">Online</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="font-medium">45 days</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <p className="text-2xl font-bold mt-1">42%</p>
            </div>
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Memory Usage</p>
              <p className="text-2xl font-bold mt-1">58%</p>
            </div>
            <div className="p-3 rounded border border-border">
              <p className="text-sm text-muted-foreground">Disk Usage</p>
              <p className="text-2xl font-bold mt-1">71%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
