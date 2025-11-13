"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function LogsAnalyticsView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Logs & Analytics</h2>
        <p className="text-muted-foreground mt-1">Analyze system logs and activity</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
        <Input placeholder="Search logs..." className="pl-10" />
      </div>

      {/* Log Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">48,392</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">128</div>
            <p className="text-xs text-muted-foreground mt-1">0.26% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">342</div>
            <p className="text-xs text-muted-foreground mt-1">0.71% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Log Entries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { level: "INFO", message: "User login successful", timestamp: "2025-11-14 14:32:45" },
            { level: "WARNING", message: "High memory usage detected", timestamp: "2025-11-14 14:25:12" },
            { level: "ERROR", message: "Database connection timeout", timestamp: "2025-11-14 14:18:33" },
            { level: "INFO", message: "Backup completed successfully", timestamp: "2025-11-14 02:34:56" },
          ].map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border">
              <Badge variant={log.level === "ERROR" ? "destructive" : log.level === "WARNING" ? "outline" : "default"}>
                {log.level}
              </Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">{log.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
