"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Download,
  Eye,
  TrendingDown
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorEarlyWarningView() {
  const warningStats = [
    {
      title: "Total Alerts",
      value: "42",
      change: "+8 from last week",
      icon: AlertTriangle
    },
    {
      title: "Students at Risk",
      value: "28",
      change: "+3 from yesterday",
      icon: TrendingDown
    },
    {
      title: "Interventions Completed",
      value: "35",
      change: "+5 from last week",
      icon: AlertTriangle
    },
    {
      title: "Success Rate",
      value: "78%",
      change: "+4% from last term",
      icon: TrendingDown
    }
  ];

  const alertTrends = [
    { week: "Week 1", alerts: 12, interventions: 8 },
    { week: "Week 2", alerts: 15, interventions: 10 },
    { week: "Week 3", alerts: 18, interventions: 12 },
    { week: "Week 4", alerts: 14, interventions: 9 },
    { week: "Week 5", alerts: 16, interventions: 11 },
    { week: "Week 6", alerts: 13, interventions: 8 }
  ];

  const alerts = [
    { 
      id: "ALT-001", 
      student: "John Doe", 
      gpa: 2.1,
      riskLevel: "High",
      courses: ["Calculus II", "Physics II"],
      lastUpdated: "2023-06-15",
      status: "Pending"
    },
    { 
      id: "ALT-002", 
      student: "Jane Smith", 
      gpa: 2.4,
      riskLevel: "Medium",
      courses: ["Organic Chemistry", "Biology II"],
      lastUpdated: "2023-06-14",
      status: "In Progress"
    },
    { 
      id: "ALT-003", 
      student: "Robert Johnson", 
      gpa: 1.8,
      riskLevel: "High",
      courses: ["Statistics", "Computer Science II"],
      lastUpdated: "2023-06-12",
      status: "Completed"
    },
    { 
      id: "ALT-004", 
      student: "Emily Davis", 
      gpa: 2.6,
      riskLevel: "Low",
      courses: ["Research Methods", "Advanced Mathematics"],
      lastUpdated: "2023-06-10",
      status: "Pending"
    },
    { 
      id: "ALT-005", 
      student: "Michael Wilson", 
      gpa: 2.3,
      riskLevel: "Medium",
      courses: ["Economics", "Business Analytics"],
      lastUpdated: "2023-06-08",
      status: "In Progress"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Early Warning Alert System</h1>
        <p className="text-muted-foreground">
          Monitor student performance and identify at-risk students for timely intervention.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {warningStats.map((stat, index) => (
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
            <CardTitle>Alert Trends</CardTitle>
            <CardDescription>
              Number of alerts and interventions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertTrends}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="alerts" fill="#ef4444" name="Alerts" />
                <Bar dataKey="interventions" fill="#10b981" name="Interventions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common early warning tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Generate Alerts
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Alerts
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Risk Level
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>At-Risk Students</CardTitle>
          <CardDescription>
            List of students requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{alert.student}</p>
                  <p className="text-xs text-muted-foreground">{alert.id}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {alert.courses.map((course, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Current GPA</p>
                    <p className="text-sm font-medium">{alert.gpa}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <Badge 
                      variant={
                        alert.riskLevel === "High" 
                          ? "destructive" 
                          : alert.riskLevel === "Medium" 
                          ? "secondary" 
                          : "outline"
                      }
                    >
                      {alert.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-medium">{alert.lastUpdated}</p>
                  </div>
                  <Badge 
                    variant={
                      alert.status === "Completed" 
                        ? "default" 
                        : alert.status === "In Progress" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {alert.status}
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