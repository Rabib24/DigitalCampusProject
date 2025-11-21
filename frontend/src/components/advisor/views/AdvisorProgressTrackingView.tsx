"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Search, 
  Filter,
  Download
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorProgressTrackingView() {
  const progressStats = [
    {
      title: "Avg. GPA",
      value: "3.42",
      change: "+0.15 from last term",
      icon: Award
    },
    {
      title: "At Risk Students",
      value: "5",
      change: "-2 from intervention",
      icon: AlertTriangle
    },
    {
      title: "Improving Students",
      value: "12",
      change: "+3 from last month",
      icon: TrendingUp
    },
    {
      title: "Graduating Soon",
      value: "8",
      change: "+2 from credit completion",
      icon: Award
    }
  ];

  const gpaTrends = [
    { semester: "Spring 2022", gpa: 3.25 },
    { semester: "Fall 2022", gpa: 3.30 },
    { semester: "Spring 2023", gpa: 3.38 },
    { semester: "Fall 2023", gpa: 3.42 }
  ];

  const studentProgress = [
    { 
      id: "STU-001", 
      name: "John Doe", 
      major: "Computer Science", 
      currentGPA: 3.8, 
      previousGPA: 3.6,
      status: "Improving",
      creditsCompleted: 95,
      creditsRequired: 120
    },
    { 
      id: "STU-002", 
      name: "Jane Smith", 
      major: "Mathematics", 
      currentGPA: 3.9, 
      previousGPA: 3.8,
      status: "Excellent",
      creditsCompleted: 88,
      creditsRequired: 120
    },
    { 
      id: "STU-003", 
      name: "Robert Johnson", 
      major: "Physics", 
      currentGPA: 2.8, 
      previousGPA: 3.2,
      status: "At Risk",
      creditsCompleted: 76,
      creditsRequired: 120
    },
    { 
      id: "STU-004", 
      name: "Emily Davis", 
      major: "Biology", 
      currentGPA: 3.6, 
      previousGPA: 3.5,
      status: "Stable",
      creditsCompleted: 102,
      creditsRequired: 120
    },
    { 
      id: "STU-005", 
      name: "Michael Wilson", 
      major: "Chemistry", 
      currentGPA: 3.1, 
      previousGPA: 2.9,
      status: "Improving",
      creditsCompleted: 65,
      creditsRequired: 120
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground">
          Monitor and track the academic progress of your advisees.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {progressStats.map((stat, index) => (
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
            <CardTitle>GPA Trends</CardTitle>
            <CardDescription>
              Average GPA progression over semesters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gpaTrends}>
                <XAxis dataKey="semester" />
                <YAxis domain={[3.0, 4.0]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="gpa" 
                  stroke="#3b82f6" 
                  name="Average GPA" 
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
              Common progress tracking tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Progress Report
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Students
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Progress Overview</CardTitle>
          <CardDescription>
            Detailed progress information for your advisees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentProgress.map((student, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.id} • {student.major}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Current GPA</p>
                    <p className="text-sm font-medium">{student.currentGPA}</p>
                    <p className="text-xs text-muted-foreground">
                      Previous: {student.previousGPA}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="text-sm font-medium">
                      {student.creditsCompleted}/{student.creditsRequired}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      student.status === "Excellent" 
                        ? "default" 
                        : student.status === "Improving" 
                        ? "secondary" 
                        : student.status === "At Risk" 
                        ? "destructive" 
                        : "outline"
                    }
                  >
                    {student.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}