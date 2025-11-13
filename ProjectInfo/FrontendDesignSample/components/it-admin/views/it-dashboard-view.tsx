"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Server, Users, Lock, HardDrive } from "lucide-react"

export function ITDashboardView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">IT Admin Dashboard</h2>
        <p className="text-muted-foreground mt-1">System health, security, and user management</p>
      </div>

      <Alert className="border-accent/50 bg-accent/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>System Status</AlertTitle>
        <AlertDescription>All systems operational. Scheduled maintenance on Nov 20 from 2-4 AM</AlertDescription>
      </Alert>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">99.98%</div>
            <p className="text-xs text-muted-foreground mt-1">45 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">4,562</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Server Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">42%</div>
            <p className="text-xs text-muted-foreground mt-1">Normal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground mt-1">Under review</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle size={20} />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">Security Patch Application</h4>
                <p className="text-xs text-muted-foreground mt-1">2 servers requiring patches</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
            <div className="flex items-start justify-between p-3 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-sm">User Provisioning Requests</h4>
                <p className="text-xs text-muted-foreground mt-1">5 new users awaiting setup</p>
              </div>
              <Badge>Pending</Badge>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">View All Tasks</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Users size={16} />
              User Management
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Lock size={16} />
              Security Settings
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <Server size={16} />
              Server Status
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <HardDrive size={16} />
              Backup System
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Infrastructure Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Web Servers", status: "Online", count: "3/3" },
            { name: "Database Servers", status: "Online", count: "2/2" },
            { name: "Cache Servers", status: "Online", count: "2/2" },
            { name: "Backup Systems", status: "Online", count: "1/1" },
          ].map((item) => (
            <div key={item.name} className="p-3 rounded-lg border border-border">
              <p className="text-sm font-medium">{item.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <Badge variant="default">{item.status}</Badge>
                <span className="text-sm text-muted-foreground">{item.count}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
