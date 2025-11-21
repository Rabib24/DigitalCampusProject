"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Printer,
  Mail
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ITAdminReportsView() {
  const reportStats = [
    {
      title: "Total Reports",
      value: "124",
      change: "+12 from last month",
      icon: FileText
    },
    {
      title: "Generated This Week",
      value: "24",
      change: "+5 from last week",
      icon: BarChart3
    },
    {
      title: "Pending Reports",
      value: "8",
      change: "-3 from yesterday",
      icon: Calendar
    },
    {
      title: "Automated Reports",
      value: "67",
      change: "+4 from schedule update",
      icon: Download
    }
  ];

  const systemPerformance = [
    { month: "Jan", uptime: 99.2, response: 42, errors: 12 },
    { month: "Feb", uptime: 99.5, response: 38, errors: 8 },
    { month: "Mar", uptime: 99.8, response: 25, errors: 5 },
    { month: "Apr", uptime: 99.6, response: 31, errors: 9 },
    { month: "May", uptime: 99.9, response: 18, errors: 2 },
    { month: "Jun", uptime: 99.7, response: 28, errors: 7 }
  ];

  const recentReports = [
    { 
      id: "REP-001", 
      name: "Monthly System Performance", 
      type: "System", 
      status: "Generated", 
      date: "2023-06-15",
      generatedBy: "Auto"
    },
    { 
      id: "REP-002", 
      name: "User Activity Analysis", 
      type: "Analytics", 
      status: "Generated", 
      date: "2023-06-14",
      generatedBy: "Manual"
    },
    { 
      id: "REP-003", 
      name: "Security Audit Report", 
      type: "Security", 
      status: "Pending", 
      date: "2023-06-16",
      generatedBy: "Scheduled"
    },
    { 
      id: "REP-004", 
      name: "Database Performance", 
      type: "Database", 
      status: "Generating", 
      date: "2023-06-15",
      generatedBy: "Auto"
    }
  ];

  const reportTypes = [
    { type: "System Performance", count: 34, frequency: "Weekly" },
    { type: "User Analytics", count: 28, frequency: "Daily" },
    { type: "Security Reports", count: 18, frequency: "Monthly" },
    { type: "Database Reports", count: 15, frequency: "Weekly" },
    { type: "Network Reports", count: 12, frequency: "Daily" },
    { type: "Custom Reports", count: 17, frequency: "On Demand" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate, view, and manage system reports and analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportStats.map((stat, index) => (
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
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Performance Trends</CardTitle>
            <CardDescription>
              Uptime and response time over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemPerformance}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="uptime" stroke="#3b82f6" name="Uptime (%)" />
                <Line yAxisId="right" type="monotone" dataKey="response" stroke="#10b981" name="Response Time (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Distribution</CardTitle>
            <CardDescription>
              Types of reports and their frequency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportTypes.map((report, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{report.type}</p>
                    <p className="text-xs text-muted-foreground">Frequency: {report.frequency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{report.count} reports</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Latest generated and pending reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{report.name}</p>
                  <p className="text-xs text-muted-foreground">{report.id} • {report.type} Report</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{report.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Generated By</p>
                    <p className="text-sm font-medium">{report.generatedBy}</p>
                  </div>
                  <Badge 
                    variant={
                      report.status === "Generated" 
                        ? "default" 
                        : report.status === "Pending" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Tools</CardTitle>
          <CardDescription>
            Quick access to report generation and management tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter Reports
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}