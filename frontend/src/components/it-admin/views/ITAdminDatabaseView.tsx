"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  HardDrive, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Settings,
  RefreshCw
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie, PieChart } from "recharts";

export function ITAdminDatabaseView() {
  const databaseStatus = [
    {
      id: "DB-PRD-01",
      name: "Primary Production DB",
      status: "Operational",
      size: "1.2 TB",
      connections: "245",
      queries: "12,450/min"
    },
    {
      id: "DB-REP-01",
      name: "Replica Database",
      status: "Operational",
      size: "1.2 TB",
      connections: "89",
      queries: "8,230/min"
    },
    {
      id: "DB-DEV-01",
      name: "Development DB",
      status: "Maintenance",
      size: "320 GB",
      connections: "12",
      queries: "450/min"
    },
    {
      id: "DB-ANL-01",
      name: "Analytics Warehouse",
      status: "Operational",
      size: "3.4 TB",
      connections: "34",
      queries: "1,200/min"
    }
  ];

  const performanceData = [
    { time: "00:00", latency: 12, throughput: 4500 },
    { time: "04:00", latency: 8, throughput: 3200 },
    { time: "08:00", latency: 25, throughput: 8900 },
    { time: "12:00", latency: 42, throughput: 12500 },
    { time: "16:00", latency: 38, throughput: 11800 },
    { time: "20:00", latency: 31, throughput: 9200 }
  ];

  const databaseMetrics = [
    {
      title: "Total Databases",
      value: "12",
      change: "+2 from last month",
      icon: Database
    },
    {
      title: "Active Queries",
      value: "22,330",
      change: "+1,240 from last hour",
      icon: BarChart3
    },
    {
      title: "Avg. Query Time",
      value: "28ms",
      change: "-5ms from optimization",
      icon: Clock
    },
    {
      title: "Storage Used",
      value: "6.1 TB",
      change: "+180 GB this week",
      icon: HardDrive
    }
  ];

  const tableDistribution = [
    { name: "Users", size: "120 GB", percentage: 20, color: "#3b82f6" },
    { name: "Courses", size: "85 GB", percentage: 14, color: "#10b981" },
    { name: "Assignments", size: "210 GB", percentage: 34, color: "#f59e0b" },
    { name: "Library", size: "95 GB", percentage: 15, color: "#ef4444" },
    { name: "Others", size: "100 GB", percentage: 17, color: "#8b5cf6" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Database Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage database systems and performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {databaseMetrics.map((metric, index) => (
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
            <CardTitle>Database Performance</CardTitle>
            <CardDescription>
              Query latency and throughput over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="latency" fill="#3b82f6" name="Latency (ms)" />
                <Bar yAxisId="right" dataKey="throughput" fill="#10b981" name="Throughput (queries/min)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Distribution</CardTitle>
            <CardDescription>
              Data distribution across major table categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tableDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {tableDistribution.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Instances</CardTitle>
          <CardDescription>
            Status of all database instances and their metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {databaseStatus.map((db, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-3 ${
                    db.status === "Operational" 
                      ? "bg-green-500" 
                      : db.status === "Maintenance" 
                      ? "bg-blue-500" 
                      : "bg-yellow-500"
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium">{db.name}</p>
                    <p className="text-xs text-muted-foreground">{db.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Size</p>
                    <p className="text-sm font-medium">{db.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Connections</p>
                    <p className="text-sm font-medium">{db.connections}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Queries</p>
                    <p className="text-sm font-medium">{db.queries}</p>
                  </div>
                  <Badge 
                    variant={
                      db.status === "Operational" 
                        ? "default" 
                        : db.status === "Maintenance" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {db.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Tools</CardTitle>
          <CardDescription>
            Quick access to database management utilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Maintenance
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configure Database
            </Button>
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Backup Database
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Performance Analysis
            </Button>
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Query Optimization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}