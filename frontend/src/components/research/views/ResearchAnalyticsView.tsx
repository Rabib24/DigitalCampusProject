"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Download, 
  Filter, 
  TrendingUp,
  Award,
  Users,
  FlaskConical
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie, PieChart } from "recharts";

export function ResearchAnalyticsView() {
  const analyticsStats = [
    {
      title: "Research Output",
      value: "156",
      change: "+12 this year",
      icon: FlaskConical
    },
    {
      title: "Citation Impact",
      value: "2,450",
      change: "+320 from last year",
      icon: Award
    },
    {
      title: "Collaboration Index",
      value: "8.4",
      change: "+0.6 from last year",
      icon: Users
    },
    {
      title: "Funding Success Rate",
      value: "72%",
      change: "+8% from last cycle",
      icon: TrendingUp
    }
  ];

  const researchOutput = [
    { month: "Jan", publications: 12, projects: 3 },
    { month: "Feb", publications: 15, projects: 4 },
    { month: "Mar", publications: 18, projects: 5 },
    { month: "Apr", publications: 14, projects: 4 },
    { month: "May", publications: 22, projects: 6 },
    { month: "Jun", publications: 18, projects: 5 }
  ];

  const departmentDistribution = [
    { department: "Computer Science", output: 42, color: "#3b82f6" },
    { department: "Physics", output: 28, color: "#10b981" },
    { department: "Biology", output: 35, color: "#f59e0b" },
    { department: "Engineering", output: 31, color: "#ef4444" },
    { department: "Environmental Science", output: 20, color: "#8b5cf6" }
  ];

  const impactMetrics = [
    { 
      id: "IMP-001", 
      metric: "H-Index", 
      value: "24", 
      trend: "Increasing",
      department: "Computer Science"
    },
    { 
      id: "IMP-002", 
      metric: "Citation Count", 
      value: "2,450", 
      trend: "Increasing",
      department: "All Departments"
    },
    { 
      id: "IMP-003", 
      metric: "Collaboration Score", 
      value: "8.4", 
      trend: "Stable",
      department: "Interdisciplinary"
    },
    { 
      id: "IMP-004", 
      metric: "Grant Success Rate", 
      value: "72%", 
      trend: "Increasing",
      department: "All Departments"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research Analytics</h1>
        <p className="text-muted-foreground">
          Analyze research output, impact metrics, and performance trends.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsStats.map((stat, index) => (
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
            <CardTitle>Research Output Trends</CardTitle>
            <CardDescription>
              Publications and projects over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={researchOutput}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="publications" 
                  stroke="#3b82f6" 
                  name="Publications" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="#10b981" 
                  name="Projects" 
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
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>
              Research output by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="output"
                  nameKey="department"
                  label={({ department, output }) => `${department}: ${output}`}
                >
                  {departmentDistribution.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} outputs`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impact Metrics</CardTitle>
          <CardDescription>
            Key performance indicators for research impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{metric.metric}</p>
                  <p className="text-xs text-muted-foreground">{metric.id} • {metric.department}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <Badge 
                    variant={
                      metric.trend === "Increasing" 
                        ? "default" 
                        : metric.trend === "Stable" 
                        ? "secondary" 
                        : "outline"
                    }
                  >
                    {metric.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Tools</CardTitle>
          <CardDescription>
            Export and analyze research data
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
              Filter by Period
            </Button>
            <Button variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Compare Departments
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}