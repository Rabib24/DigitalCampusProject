"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Eye,
  TrendingUp
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdminStudentEnrollmentView() {
  const enrollmentStats = [
    {
      title: "Total Students",
      value: "4,287",
      change: "+142 from last semester",
      icon: Users
    },
    {
      title: "New Enrollments",
      value: "245",
      change: "+25 from last month",
      icon: TrendingUp
    },
    {
      title: "Dropouts",
      value: "32",
      change: "-8 from intervention",
      icon: Users
    },
    {
      title: "Waitlisted",
      value: "78",
      change: "+12 from course demand",
      icon: Users
    }
  ];

  const enrollmentTrends = [
    { month: "Jan", enrolled: 120, dropped: 5 },
    { month: "Feb", enrolled: 180, dropped: 8 },
    { month: "Mar", enrolled: 245, dropped: 12 },
    { month: "Apr", enrolled: 190, dropped: 7 },
    { month: "May", enrolled: 165, dropped: 6 },
    { month: "Jun", enrolled: 142, dropped: 4 }
  ];

  const studentEnrollments = [
    { 
      id: "STU-001", 
      name: "John Doe", 
      program: "Computer Science", 
      year: "2nd Year",
      courses: 5,
      status: "Active",
      enrollmentDate: "2023-01-15"
    },
    { 
      id: "STU-002", 
      name: "Jane Smith", 
      program: "Mathematics", 
      year: "3rd Year",
      courses: 4,
      status: "Active",
      enrollmentDate: "2022-09-01"
    },
    { 
      id: "STU-003", 
      name: "Robert Johnson", 
      program: "Physics", 
      year: "1st Year",
      courses: 6,
      status: "Pending",
      enrollmentDate: "2023-06-01"
    },
    { 
      id: "STU-004", 
      name: "Emily Davis", 
      program: "Biology", 
      year: "4th Year",
      courses: 3,
      status: "Active",
      enrollmentDate: "2020-09-01"
    },
    { 
      id: "STU-005", 
      name: "Michael Wilson", 
      program: "Chemistry", 
      year: "2nd Year",
      courses: 5,
      status: "On Leave",
      enrollmentDate: "2022-09-01"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Enrollment Tracking</h1>
        <p className="text-muted-foreground">
          Monitor student enrollments, track trends, and manage enrollment status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {enrollmentStats.map((stat, index) => (
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
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>
              New enrollments and dropouts over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="enrolled" fill="#3b82f6" name="New Enrollments" />
                <Bar dataKey="dropped" fill="#ef4444" name="Dropouts" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common enrollment management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Process New Enrollments
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Students
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Program
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Enrollment Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Enrollment Details</CardTitle>
          <CardDescription>
            Detailed enrollment information for each student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentEnrollments.map((student, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.id} • {student.program}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Year</p>
                    <p className="text-sm font-medium">{student.year}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Courses</p>
                    <p className="text-sm font-medium">{student.courses}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Enrolled</p>
                    <p className="text-sm font-medium">{student.enrollmentDate}</p>
                  </div>
                  <Badge 
                    variant={
                      student.status === "Active" 
                        ? "default" 
                        : student.status === "Pending" 
                        ? "secondary" 
                        : student.status === "On Leave" 
                        ? "destructive" 
                        : "outline"
                    }
                  >
                    {student.status}
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