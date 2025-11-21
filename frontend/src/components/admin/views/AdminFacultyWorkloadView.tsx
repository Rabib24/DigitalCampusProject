"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Search, 
  Filter, 
  Download,
  Eye,
  TrendingUp
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdminFacultyWorkloadView() {
  const workloadStats = [
    {
      title: "Average Workload",
      value: "85%",
      change: "+2% from last semester",
      icon: BarChart3
    },
    {
      title: "Overloaded Faculty",
      value: "12",
      change: "-3 from intervention",
      icon: TrendingUp
    },
    {
      title: "Underloaded Faculty",
      value: "8",
      change: "+1 from new hires",
      icon: BarChart3
    },
    {
      title: "Optimal Workload",
      value: "104",
      change: "+5 from adjustments",
      icon: TrendingUp
    }
  ];

  const workloadData = [
    { department: "Computer Science", avgLoad: 82, overloaded: 3, underloaded: 2 },
    { department: "Mathematics", avgLoad: 78, overloaded: 2, underloaded: 3 },
    { department: "Physics", avgLoad: 88, overloaded: 4, underloaded: 1 },
    { department: "Biology", avgLoad: 85, overloaded: 3, underloaded: 2 },
    { department: "Chemistry", avgLoad: 79, overloaded: 2, underloaded: 3 },
    { department: "Engineering", avgLoad: 91, overloaded: 5, underloaded: 1 },
    { department: "Business", avgLoad: 76, overloaded: 1, underloaded: 4 }
  ];

  const facultyWorkloads = [
    { 
      id: "FAC-001", 
      name: "Dr. Jane Smith", 
      department: "Computer Science", 
      courses: 4,
      students: 120,
      workload: "85%",
      status: "Optimal"
    },
    { 
      id: "FAC-002", 
      name: "Dr. Robert Johnson", 
      department: "Physics", 
      courses: 5,
      students: 150,
      workload: "95%",
      status: "Overloaded"
    },
    { 
      id: "FAC-003", 
      name: "Dr. Emily Davis", 
      department: "Biology", 
      courses: 3,
      students: 90,
      workload: "70%",
      status: "Underloaded"
    },
    { 
      id: "FAC-004", 
      name: "Dr. Michael Wilson", 
      department: "Mathematics", 
      courses: 4,
      students: 110,
      workload: "82%",
      status: "Optimal"
    },
    { 
      id: "FAC-005", 
      name: "Dr. Sarah Brown", 
      department: "Engineering", 
      courses: 6,
      students: 180,
      workload: "105%",
      status: "Overloaded"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faculty Workload Tracking</h1>
        <p className="text-muted-foreground">
          Monitor and balance faculty workloads across departments.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {workloadStats.map((stat, index) => (
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
            <CardTitle>Workload by Department</CardTitle>
            <CardDescription>
              Average workload and distribution across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workloadData}>
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgLoad" fill="#3b82f6" name="Average Load (%)" />
                <Bar dataKey="overloaded" fill="#ef4444" name="Overloaded Faculty" />
                <Bar dataKey="underloaded" fill="#10b981" name="Underloaded Faculty" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common workload management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Workload Report
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Faculty
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
          <CardTitle>Faculty Workload Details</CardTitle>
          <CardDescription>
            Detailed workload information for each faculty member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facultyWorkloads.map((faculty, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{faculty.name}</p>
                  <p className="text-xs text-muted-foreground">{faculty.id} • {faculty.department}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Courses</p>
                    <p className="text-sm font-medium">{faculty.courses}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="text-sm font-medium">{faculty.students}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Workload</p>
                    <p className="text-sm font-medium">{faculty.workload}</p>
                  </div>
                  <Badge 
                    variant={
                      faculty.status === "Optimal" 
                        ? "default" 
                        : faculty.status === "Overloaded" 
                        ? "destructive" 
                        : "secondary"
                    }
                  >
                    {faculty.status}
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