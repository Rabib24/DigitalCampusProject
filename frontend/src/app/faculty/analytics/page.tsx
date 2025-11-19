"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { BarChart3, Download, Calendar, TrendingUp, BookOpen, Users, Award } from "lucide-react";
import { useFaculty } from "@/hooks/faculty/FacultyContext";
import Link from "next/link";

interface AttendanceData {
  name: string;
  attendance: number;
}

interface GradeDistributionData {
  name: string;
  value: number;
}

interface StudentPerformanceData {
  week: string;
  [key: string]: number | string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function FacultyAnalyticsPage() {
  const { state } = useFaculty();
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [gradeDistributionData, setGradeDistributionData] = useState<GradeDistributionData[]>([]);
  const [studentPerformanceData, setStudentPerformanceData] = useState<StudentPerformanceData[]>([]);
  const [stats, setStats] = useState({
    averageAttendance: 0,
    avgAssignmentScore: 0,
    studentEngagement: 0,
    coursesTaught: 0
  });
  const [loading, setLoading] = useState(true);

  // In a real implementation, we would fetch analytics data from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAttendanceData([
        { name: "CS-101", attendance: 85 },
        { name: "CS-205", attendance: 78 },
        { name: "CS-301", attendance: 92 },
        { name: "CS-401", attendance: 88 },
      ]);
      
      setGradeDistributionData([
        { name: "A", value: 15 },
        { name: "B", value: 25 },
        { name: "C", value: 30 },
        { name: "D", value: 18 },
        { name: "F", value: 12 },
      ]);
      
      setStudentPerformanceData([
        { week: "Week 1", cs101: 75, cs205: 80, cs301: 85 },
        { week: "Week 2", cs101: 78, cs205: 82, cs301: 87 },
        { week: "Week 3", cs101: 80, cs205: 85, cs301: 89 },
        { week: "Week 4", cs101: 82, cs205: 87, cs301: 91 },
        { week: "Week 5", cs101: 85, cs205: 89, cs301: 93 },
      ]);
      
      setStats({
        averageAttendance: 85,
        avgAssignmentScore: 82,
        studentEngagement: 78,
        coursesTaught: 4
      });
      
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">View insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-semester">This Semester</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Analytics Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/faculty/analytics/course-utilization">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Course Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">View course engagement and resource usage</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/faculty/analytics/attendance">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Attendance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Track attendance patterns and trends</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/faculty/analytics/performance">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">View student performance and grades</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Assignment Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.avgAssignmentScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Student Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.studentEngagement}%</div>
            <p className="text-xs text-muted-foreground mt-1">Participation rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Courses Taught</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.coursesTaught}</div>
            <p className="text-xs text-muted-foreground mt-1">Active this semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Attendance by Course
            </CardTitle>
            <CardDescription>Attendance rates across your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Grade Distribution
            </CardTitle>
            <CardDescription>Distribution of final grades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Student Performance Trend
          </CardTitle>
          <CardDescription>Average scores over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cs101" stroke="#3b82f6" name="CS-101" strokeWidth={2} />
                <Line type="monotone" dataKey="cs205" stroke="#10b981" name="CS-205" strokeWidth={2} />
                <Line type="monotone" dataKey="cs301" stroke="#f59e0b" name="CS-301" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
    </FacultyProtectedRoute>
  );
}