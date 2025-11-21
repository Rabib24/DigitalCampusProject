"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  BarChart3, 
  Calendar, 
  Filter,
  Printer,
  Mail,
  Eye
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorReportsView() {
  const reportStats = [
    {
      title: "Total Reports",
      value: "24",
      change: "+3 from last month",
      icon: FileText
    },
    {
      title: "Generated This Week",
      value: "5",
      change: "+1 from last week",
      icon: BarChart3
    },
    {
      title: "Pending Reports",
      value: "2",
      change: "0 from yesterday",
      icon: Calendar
    },
    {
      title: "Shared Reports",
      value: "18",
      change: "+2 from last week",
      icon: Mail
    }
  ];

  const reportTrends = [
    { month: "Jan", generated: 3, shared: 2 },
    { month: "Feb", generated: 4, shared: 3 },
    { month: "Mar", generated: 5, shared: 4 },
    { month: "Apr", generated: 4, shared: 3 },
    { month: "May", generated: 6, shared: 5 },
    { month: "Jun", generated: 5, shared: 4 }
  ];

  const reports = [
    { 
      id: "REP-001", 
      title: "Academic Progress Report - John Doe", 
      type: "Progress", 
      status: "Generated",
      date: "2023-06-15",
      sharedWith: ["John Doe", "Department Head"]
    },
    { 
      id: "REP-002", 
      title: "Research Project Status - Jane Smith", 
      type: "Research", 
      status: "Generated",
      date: "2023-06-14",
      sharedWith: ["Jane Smith", "Research Committee"]
    },
    { 
      id: "REP-003", 
      title: "Course Recommendation - Robert Johnson", 
      type: "Recommendation", 
      status: "Pending",
      date: "2023-06-16",
      sharedWith: []
    },
    { 
      id: "REP-004", 
      title: "Graduation Readiness - Emily Davis", 
      type: "Graduation", 
      status: "Generated",
      date: "2023-06-12",
      sharedWith: ["Emily Davis", "Department Head"]
    },
    { 
      id: "REP-005", 
      title: "Intervention Plan - Michael Wilson", 
      type: "Intervention", 
      status: "Pending",
      date: "2023-06-17",
      sharedWith: []
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Documentation</h1>
        <p className="text-muted-foreground">
          Generate, manage, and share reports with students and colleagues.
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
            <CardTitle>Report Generation Trends</CardTitle>
            <CardDescription>
              Reports generated and shared over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="generated" 
                  stroke="#3b82f6" 
                  name="Generated" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="shared" 
                  stroke="#10b981" 
                  name="Shared" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common report management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Type
              </Button>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
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
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.id} • {report.type} Report</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {report.sharedWith.map((person, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{report.date}</p>
                  </div>
                  <Badge 
                    variant={
                      report.status === "Generated" 
                        ? "default" 
                        : report.status === "Pending" 
                        ? "secondary" 
                        : "outline"
                    }
                  >
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}