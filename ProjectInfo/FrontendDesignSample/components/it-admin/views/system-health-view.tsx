"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SystemHealthView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">System Health</h2>
        <p className="text-muted-foreground mt-1">Monitor system performance and resources</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">42%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "42%" }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">58%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "58%" }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Disk Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">71%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "71%" }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Network I/O</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">35%</div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "35%" }} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Details */}
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Web Server 1", status: "Online", uptime: "45 days", load: "Low" },
            { name: "Database Server", status: "Online", uptime: "67 days", load: "Medium" },
            { name: "Cache Server", status: "Online", uptime: "12 days", load: "Low" },
            { name: "Backup Server", status: "Online", uptime: "89 days", load: "Idle" },
          ].map((server) => (
            <div key={server.name} className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">{server.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">Uptime: {server.uptime}</p>
              </div>
              <div className="text-right">
                <Badge className="mb-1 block">{server.status}</Badge>
                <span className="text-xs text-muted-foreground">{server.load}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
