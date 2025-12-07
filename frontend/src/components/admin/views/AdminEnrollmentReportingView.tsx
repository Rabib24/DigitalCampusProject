"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Search, 
  Download, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { AdminEnrollmentReportingService, type EnrollmentReportSummary } from "@/lib/admin/enrollment-reporting";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AdminEnrollmentReportingView() {
  const [report, setReport] = useState<EnrollmentReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [reportType, setReportType] = useState("summary");

  // Load report data on component mount
  useEffect(() => {
    loadReportData();
  }, [selectedDepartment]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const data = await AdminEnrollmentReportingService.getEnrollmentSummaryReport(selectedDepartment || undefined);
      setReport(data);
    } catch (err) {
      setError("Failed to load enrollment report data");
      console.error("Report load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // In a real implementation, this would export the report data
    alert("Export functionality would be implemented here");
  };

  // Prepare data for charts
  const enrollmentStatusData = report?.enrollment_by_status.map(status => ({
    name: status.status.charAt(0).toUpperCase() + status.status.slice(1),
    value: status.count
  })) || [];

  const topCoursesData = report?.top_courses.map(course => ({
    name: course.course_code,
    value: course.enrollment_count
  })) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Enrollment Reporting</h1>
          <p className="text-muted-foreground">
            Comprehensive enrollment analytics and reporting dashboard.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">Summary Report</SelectItem>
              <SelectItem value="department">By Department</SelectItem>
              <SelectItem value="semester">By Semester</SelectItem>
              <SelectItem value="waitlist">Waitlist Report</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.total_courses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active courses in system
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.total_active_enrollments || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled students
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waitlisted</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report?.total_waitlisted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Students on waitlists
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Department</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {report?.top_courses[0]?.department || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Highest enrollment
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment by Status</CardTitle>
            <CardDescription>
              Distribution of enrollments by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrollmentStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={enrollmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {enrollmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No enrollment data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Enrolled Courses</CardTitle>
            <CardDescription>
              Courses with highest enrollment numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topCoursesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topCoursesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Enrollments" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No course data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrollment Summary</CardTitle>
          <CardDescription>
            Detailed breakdown of enrollment statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.enrollment_by_status.map((status) => {
                  const total = report.total_active_enrollments + report.total_waitlisted + 
                               report.total_dropped + report.total_completed;
                  const percentage = total > 0 ? ((status.count / total) * 100).toFixed(1) : "0.0";
                  
                  return (
                    <TableRow key={status.status}>
                      <TableCell className="font-medium">
                        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                      </TableCell>
                      <TableCell className="text-right">{status.count}</TableCell>
                      <TableCell className="text-right">{percentage}%</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow className="bg-muted">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    {(report?.total_active_enrollments || 0) + 
                     (report?.total_waitlisted || 0) + 
                     (report?.total_dropped || 0) + 
                     (report?.total_completed || 0)}
                  </TableCell>
                  <TableCell className="text-right font-bold">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Courses by Enrollment</CardTitle>
          <CardDescription>
            Courses with the highest number of enrolled students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Enrollments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.top_courses.map((course) => (
                  <TableRow key={course.course_id}>
                    <TableCell className="font-medium">{course.course_code}</TableCell>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{course.department}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{course.enrollment_count}</TableCell>
                  </TableRow>
                ))}
                {report?.top_courses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No course data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}