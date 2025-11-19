"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, TrendingUp, Users, Clock, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface AttendanceData {
  date: string;
  attendanceRate: number;
  present: number;
  absent: number;
  late: number;
}

interface CourseAttendanceData {
  course: string;
  attendanceRate: number;
  present: number;
  total: number;
}

interface AttendanceTrendData {
  week: string;
  rate: number;
}

const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

export default function AttendanceAnalyticsPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [courseData, setCourseData] = useState<CourseAttendanceData[]>([]);
  const [trendData, setTrendData] = useState<AttendanceTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock data - in a real implementation, this would come from an API
        const mockAttendanceData: AttendanceData[] = [
          { date: "2023-10-01", attendanceRate: 92, present: 110, absent: 8, late: 2 },
          { date: "2023-10-02", attendanceRate: 88, present: 105, absent: 12, late: 3 },
          { date: "2023-10-03", attendanceRate: 95, present: 114, absent: 4, late: 2 },
          { date: "2023-10-04", attendanceRate: 90, present: 108, absent: 9, late: 3 },
          { date: "2023-10-05", attendanceRate: 93, present: 112, absent: 6, late: 2 },
          { date: "2023-10-06", attendanceRate: 89, present: 107, absent: 10, late: 3 },
          { date: "2023-10-07", attendanceRate: 96, present: 115, absent: 3, late: 2 },
        ];

        const mockCourseData: CourseAttendanceData[] = [
          { course: "CS-101", attendanceRate: 92, present: 110, total: 120 },
          { course: "CS-205", attendanceRate: 88, present: 84, total: 95 },
          { course: "CS-301", attendanceRate: 95, present: 74, total: 78 },
          { course: "CS-401", attendanceRate: 90, present: 59, total: 65 },
        ];

        const mockTrendData: AttendanceTrendData[] = [
          { week: "Week 1", rate: 88 },
          { week: "Week 2", rate: 90 },
          { week: "Week 3", rate: 92 },
          { week: "Week 4", rate: 91 },
          { week: "Week 5", rate: 93 },
          { week: "Week 6", rate: 94 },
          { week: "Week 7", rate: 95 },
          { week: "Week 8", rate: 96 },
        ];

        setAttendanceData(mockAttendanceData);
        setCourseData(mockCourseData);
        setTrendData(mockTrendData);
      } catch (err) {
        setError("Failed to load attendance analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Attendance Analytics</h2>
            <p className="text-muted-foreground mt-1">Track attendance patterns and trends</p>
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
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Math.round(attendanceData.reduce((sum, day) => sum + day.attendanceRate, 0) / attendanceData.length)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {attendanceData.reduce((sum, day) => sum + day.present, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Students this period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {attendanceData.reduce((sum, day) => sum + day.absent, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Students this period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Best Performing Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {courseData.reduce((max, course) => course.attendanceRate > max.attendanceRate ? course : max, courseData[0]).course}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.max(...courseData.map(c => c.attendanceRate))}% attendance
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Daily Attendance
              </CardTitle>
              <CardDescription>Attendance rates by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendanceRate" fill="#3b82f6" name="Attendance %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Attendance Distribution
              </CardTitle>
              <CardDescription>Present, absent, and late students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Present", value: attendanceData.reduce((sum, day) => sum + day.present, 0) },
                        { name: "Absent", value: attendanceData.reduce((sum, day) => sum + day.absent, 0) },
                        { name: "Late", value: attendanceData.reduce((sum, day) => sum + day.late, 0) }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
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

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Attendance Trend
              </CardTitle>
              <CardDescription>Weekly attendance trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#3b82f6" 
                      name="Attendance %" 
                      strokeWidth={2} 
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Course Attendance
              </CardTitle>
              <CardDescription>Attendance rates by course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendanceRate" fill="#10b981" name="Attendance %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FacultyProtectedRoute>
  );
}