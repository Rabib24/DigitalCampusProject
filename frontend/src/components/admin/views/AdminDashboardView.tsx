"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, DollarSign, FileText, BarChart3, Shield } from "lucide-react";

export function AdminDashboardView() {
  const stats = [
    {
      title: "Total Users",
      value: "1,247",
      description: "+12% from last month",
      icon: Users,
    },
    {
      title: "Active Courses",
      value: "89",
      description: "+5% from last month",
      icon: BookOpen,
    },
    {
      title: "Total Payments",
      value: "$45,231",
      description: "+18% from last month",
      icon: DollarSign,
    },
    {
      title: "Pending Requests",
      value: "24",
      description: "+3 from last week",
      icon: FileText,
    },
    {
      title: "System Health",
      value: "98%",
      description: "All systems operational",
      icon: BarChart3,
    },
    {
      title: "Security Alerts",
      value: "0",
      description: "No active threats",
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your system today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and user activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New user registered", user: "John Doe", time: "2 minutes ago" },
                { action: "Course created", user: "Mathematics 101", time: "15 minutes ago" },
                { action: "Payment processed", user: "$150.00", time: "1 hour ago" },
                { action: "System backup completed", user: "Daily backup", time: "2 hours ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.user}</p>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system performance and health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: "Database", status: "Operational", uptime: "99.9%" },
                { service: "Web Server", status: "Operational", uptime: "99.8%" },
                { service: "API Gateway", status: "Operational", uptime: "99.95%" },
                { service: "Cache Server", status: "Operational", uptime: "99.7%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.service}</p>
                    <p className="text-xs text-muted-foreground">{item.uptime} uptime</p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-xs">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}