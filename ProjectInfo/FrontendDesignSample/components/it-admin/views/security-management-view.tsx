"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield } from "lucide-react"

export function SecurityManagementView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Security Management</h2>
        <p className="text-muted-foreground mt-1">Monitor and manage system security</p>
      </div>

      <Alert className="border-destructive/50 bg-destructive/5">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive ml-2">
          2 security vulnerabilities detected - review recommended
        </AlertDescription>
      </Alert>

      {/* Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">SSL Certificate Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-500">Valid</div>
            <p className="text-xs text-muted-foreground mt-1">Expires in 89 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Firewall Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-500">Active</div>
            <p className="text-xs text-muted-foreground mt-1">All rules applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">342</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Intrusion Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">12</div>
            <p className="text-xs text-muted-foreground mt-1">All blocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { event: "Failed Login Attempt", ip: "192.168.1.105", time: "2 hours ago", severity: "Low" },
            { event: "Port Scan Detected", ip: "203.0.113.45", time: "4 hours ago", severity: "Medium" },
            { event: "SSL Certificate Validation", status: "Passed", time: "1 day ago", severity: "Info" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">{item.event}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              </div>
              <Badge
                variant={item.severity === "High" ? "destructive" : item.severity === "Medium" ? "outline" : "default"}
              >
                {item.severity}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
