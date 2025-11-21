"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock, 
  Key,
  UserCheck,
  Wifi
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ITAdminSecurityView() {
  const securityAlerts = [
    {
      id: "SEC-001",
      title: "Failed Login Attempts",
      severity: "High",
      description: "Multiple failed login attempts detected from IP 192.168.1.105",
      timestamp: "2023-06-15 14:30:22",
      status: "Unresolved"
    },
    {
      id: "SEC-002",
      title: "Suspicious File Upload",
      severity: "Medium",
      description: "Potentially malicious file uploaded to /uploads/temp/",
      timestamp: "2023-06-15 13:45:17",
      status: "Investigating"
    },
    {
      id: "SEC-003",
      title: "Outdated SSL Certificate",
      severity: "Medium",
      description: "SSL certificate for api.iub.edu.bd expires in 15 days",
      timestamp: "2023-06-15 12:15:44",
      status: "Resolved"
    },
    {
      id: "SEC-004",
      title: "Unusual Data Access",
      severity: "Low",
      description: "User accessed unusually large amount of student records",
      timestamp: "2023-06-15 11:20:33",
      status: "Monitoring"
    }
  ];

  const vulnerabilityData = [
    { name: "Critical", count: 2, color: "#ef4444" },
    { name: "High", count: 5, color: "#f97316" },
    { name: "Medium", count: 12, color: "#eab308" },
    { name: "Low", count: 24, color: "#22c55e" }
  ];

  const securityMetrics = [
    {
      title: "Active Threats",
      value: "3",
      change: "+1 from yesterday",
      icon: AlertTriangle,
      status: "warning"
    },
    {
      title: "Blocked Attacks",
      value: "142",
      change: "+12 from last week",
      icon: Shield,
      status: "good"
    },
    {
      title: "Vulnerabilities",
      value: "43",
      change: "-5 from last scan",
      icon: XCircle,
      status: "warning"
    },
    {
      title: "Compliance Score",
      value: "94%",
      change: "+2% from last audit",
      icon: CheckCircle,
      status: "good"
    }
  ];

  const recentScans = [
    { name: "Web Application", status: "Passed", date: "2023-06-15", issues: 0 },
    { name: "Network Security", status: "Warning", date: "2023-06-14", issues: 3 },
    { name: "Database Security", status: "Passed", date: "2023-06-14", issues: 0 },
    { name: "API Security", status: "Failed", date: "2023-06-13", issues: 7 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Management</h1>
        <p className="text-muted-foreground">
          Monitor and manage security threats, vulnerabilities, and compliance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className="flex items-center">
                <metric.icon className={`h-4 w-4 ${
                  metric.status === "good" 
                    ? "text-green-500" 
                    : metric.status === "warning" 
                    ? "text-yellow-500" 
                    : "text-red-500"
                }`} />
              </div>
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
            <CardTitle>Vulnerability Distribution</CardTitle>
            <CardDescription>
              Current security vulnerabilities by severity level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vulnerabilityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8">
                  {vulnerabilityData.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>
              Latest security scans and their results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentScans.map((scan, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{scan.name}</p>
                    <p className="text-xs text-muted-foreground">{scan.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        scan.status === "Passed" 
                          ? "default" 
                          : scan.status === "Warning" 
                          ? "destructive" 
                          : "secondary"
                      }
                    >
                      {scan.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scan.issues} issues
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
          <CardTitle>Security Alerts</CardTitle>
          <CardDescription>
            Recent security incidents and alerts requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert, index) => (
              <div key={index} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                <div className={`h-3 w-3 rounded-full mt-2 mr-3 ${
                  alert.severity === "High" 
                    ? "bg-red-500" 
                    : alert.severity === "Medium" 
                    ? "bg-yellow-500" 
                    : "bg-blue-500"
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.id}</p>
                    </div>
                    <Badge 
                      variant={
                        alert.status === "Unresolved" 
                          ? "destructive" 
                          : alert.status === "Investigating" 
                          ? "secondary" 
                          : "default"
                      }
                    >
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-sm mt-1">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {alert.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Tools</CardTitle>
          <CardDescription>
            Quick access to security management tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Eye className="mr-2 h-4 w-4" />
              Run Security Scan
            </Button>
            <Button variant="outline">
              <Lock className="mr-2 h-4 w-4" />
              Update Firewall Rules
            </Button>
            <Button variant="outline">
              <Key className="mr-2 h-4 w-4" />
              Rotate Keys
            </Button>
            <Button variant="outline">
              <UserCheck className="mr-2 h-4 w-4" />
              Audit User Permissions
            </Button>
            <Button variant="outline">
              <Wifi className="mr-2 h-4 w-4" />
              Network Monitoring
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}