"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Server, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  RefreshCw,
  Power,
  Settings
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ITAdminSystemsView() {
  const systemStatus = [
    {
      id: "WEB-01",
      name: "Web Server Cluster",
      type: "Web Server",
      status: "Operational",
      cpu: "45%",
      memory: "62%",
      disk: "78%",
      uptime: "99.9%"
    },
    {
      id: "DB-01",
      name: "Primary Database",
      type: "Database",
      status: "Operational",
      cpu: "32%",
      memory: "71%",
      disk: "65%",
      uptime: "99.8%"
    },
    {
      id: "APP-01",
      name: "Application Server",
      type: "Application",
      status: "Degraded",
      cpu: "85%",
      memory: "89%",
      disk: "42%",
      uptime: "98.2%"
    },
    {
      id: "AUTH-01",
      name: "Authentication Service",
      type: "Service",
      status: "Maintenance",
      cpu: "12%",
      memory: "28%",
      disk: "35%",
      uptime: "95.1%"
    }
  ];

  const performanceData = [
    { time: "00:00", web: 45, db: 32, app: 55 },
    { time: "04:00", web: 22, db: 18, app: 30 },
    { time: "08:00", web: 68, db: 45, app: 75 },
    { time: "12:00", web: 82, db: 65, app: 89 },
    { time: "16:00", web: 75, db: 58, app: 82 },
    { time: "20:00", web: 60, db: 42, app: 65 }
  ];

  const systemMetrics = [
    {
      title: "Total Servers",
      value: "24",
      change: "+2 from last month",
      icon: Server
    },
    {
      title: "Active Services",
      value: "156",
      change: "+8 from last week",
      icon: Power
    },
    {
      title: "System Load",
      value: "62%",
      change: "-5% from peak",
      icon: Cpu
    },
    {
      title: "Storage Used",
      value: "2.4TB",
      change: "+120GB this week",
      icon: HardDrive
    }
  ];

  const maintenanceTasks = [
    { 
      id: "MT-001", 
      task: "Database Index Optimization", 
      status: "Scheduled", 
      schedule: "2023-06-18 02:00 AM" 
    },
    { 
      id: "MT-002", 
      task: "Web Server Security Patch", 
      status: "In Progress", 
      schedule: "2023-06-16 11:00 PM" 
    },
    { 
      id: "MT-003", 
      task: "Backup Verification", 
      status: "Completed", 
      schedule: "2023-06-15 01:00 AM" 
    },
    { 
      id: "MT-004", 
      task: "Load Balancer Firmware Update", 
      status: "Pending", 
      schedule: "2023-06-20 10:00 PM" 
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage all IT systems and infrastructure components.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>
              CPU utilization across critical systems over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="web" stroke="#3b82f6" name="Web Servers" />
                <Line type="monotone" dataKey="db" stroke="#10b981" name="Database" />
                <Line type="monotone" dataKey="app" stroke="#f59e0b" name="Application" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Tasks</CardTitle>
            <CardDescription>
              Scheduled and ongoing system maintenance activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.id}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        task.status === "Completed" 
                          ? "default" 
                          : task.status === "In Progress" 
                          ? "destructive" 
                          : "secondary"
                      }
                    >
                      {task.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {task.schedule}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Infrastructure Status</CardTitle>
          <CardDescription>
            Current status of all critical systems and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.map((system, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-3 ${
                    system.status === "Operational" 
                      ? "bg-green-500" 
                      : system.status === "Degraded" 
                      ? "bg-yellow-500" 
                      : "bg-blue-500"
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium">{system.name}</p>
                    <p className="text-xs text-muted-foreground">{system.id} • {system.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">CPU</p>
                    <p className="text-sm font-medium">{system.cpu}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Memory</p>
                    <p className="text-sm font-medium">{system.memory}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Disk</p>
                    <p className="text-sm font-medium">{system.disk}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="text-sm font-medium">{system.uptime}</p>
                  </div>
                  <Badge 
                    variant={
                      system.status === "Operational" 
                        ? "default" 
                        : system.status === "Degraded" 
                        ? "destructive" 
                        : "secondary"
                    }
                  >
                    {system.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Tools</CardTitle>
          <CardDescription>
            Quick access to system management utilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart Services
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configure Systems
            </Button>
            <Button variant="outline">
              <Server className="mr-2 h-4 w-4" />
              Add New Server
            </Button>
            <Button variant="outline">
              <Monitor className="mr-2 h-4 w-4" />
              System Diagnostics
            </Button>
            <Button variant="outline">
              <Power className="mr-2 h-4 w-4" />
              Power Management
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}