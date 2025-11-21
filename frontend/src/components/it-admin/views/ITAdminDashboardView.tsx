"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Monitor, Database, Wifi, Users, BarChart3, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ITAdminDashboardView() {
  const stats = [
    {
      title: "System Health",
      value: "98%",
      description: "All systems operational",
      icon: CheckCircle,
      status: "good",
    },
    {
      title: "Active Users",
      value: "1,247",
      description: "+12% from last month",
      icon: Users,
      status: "normal",
    },
    {
      title: "Security Alerts",
      value: "3",
      description: "2 resolved today",
      icon: AlertTriangle,
      status: "warning",
    },
    {
      title: "Server Uptime",
      value: "99.9%",
      description: "Last 30 days",
      icon: Monitor,
      status: "good",
    },
  ];

  const systemStatus = [
    { name: "Web Server", status: "Operational", uptime: "99.9%", icon: Monitor },
    { name: "Database", status: "Operational", uptime: "99.8%", icon: Database },
    { name: "API Gateway", status: "Operational", uptime: "99.95%", icon: Wifi },
    { name: "Authentication", status: "Degraded", uptime: "95.2%", icon: Shield },
  ];

  const recentActivity = [
    { action: "System backup completed", system: "Database Server", time: "2 minutes ago", status: "success" },
    { action: "Security patch applied", system: "Web Server", time: "15 minutes ago", status: "success" },
    { action: "High CPU usage detected", system: "Authentication Server", time: "1 hour ago", status: "warning" },
    { action: "New user registered", system: "User Management", time: "2 hours ago", status: "info" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">IT Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage all IT systems and infrastructure.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="flex items-center">
                <stat.icon className={`h-4 w-4 ${
                  stat.status === "good" 
                    ? "text-green-500" 
                    : stat.status === "warning" 
                    ? "text-yellow-500" 
                    : "text-muted-foreground"
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current status of all critical systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((system, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <system.icon className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">{system.name}</p>
                      <p className="text-xs text-muted-foreground">{system.uptime} uptime</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      system.status === "Operational" 
                        ? "bg-green-500" 
                        : "bg-yellow-500"
                    }`}></div>
                    <span className="text-xs">{system.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className={`h-2 w-2 rounded-full mt-2 mr-3 ${
                    activity.status === "success" 
                      ? "bg-green-500" 
                      : activity.status === "warning" 
                      ? "bg-yellow-500" 
                      : "bg-blue-500"
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.system}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common IT administration tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Monitor className="mr-2 h-4 w-4" />
              System Diagnostics
            </Button>
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Security Scan
            </Button>
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Database Backup
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Performance Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}