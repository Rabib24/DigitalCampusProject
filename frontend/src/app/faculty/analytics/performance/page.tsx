"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Download, TrendingUp, Award, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface GradeDistributionData {
  grade: string;
  count: number;
}

interface CoursePerformanceData {
  course: string;
  avgGrade: number;
  passRate: number;
  students: number;
}

interface StudentPerformanceData {
  student: string;
  overallGrade: number;
  assignmentAvg: number;
  examAvg: number;
}

interface PerformanceTrendData {
  month: string;
  avgGrade: number;
}

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function AcademicPerformanceReportPage() {
  const [gradeData, setGradeData] = useState<GradeDistributionData[]>([]);
  const [courseData, setCourseData] = useState<CoursePerformanceData[]>([]);
  const [studentData, setStudentData] = useState<StudentPerformanceData[]>([]);
  const [trendData, setTrendData] = useState<PerformanceTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock data - in a real implementation, this would come from an API
        const mockGradeData: GradeDistributionData[] = [
          { grade: "A", count: 45 },
          { grade: "B", count: 68 },
          { grade: "C", count: 32 },
          { grade: "D", count: 15 },
          { grade: "F", count: 8 },
        ];

        const mockCourseData: CoursePerformanceData[] = [
          { course: "CS-101", avgGrade: 82, passRate: 92, students: 120 },
          { course: "CS-205", avgGrade: 78, passRate: 88, students: 95 },
          { course: "CS-301", avgGrade: 85, passRate: 95, students: 78 },
          { course: "CS-401", avgGrade: 88, passRate: 97, students: 65 },
        ];

        const mockStudentData: StudentPerformanceData[] = [
          { student: "John Smith", overallGrade: 92, assignmentAvg: 88, examAvg: 95 },
          { student: "Emily Johnson", overallGrade: 89, assignmentAvg: 90, examAvg: 87 },
          { student: "Michael Brown", overallGrade: 85, assignmentAvg: 82, examAvg: 88 },
          { student: "Sarah Davis", overallGrade: 94, assignmentAvg: 92, examAvg: 96 },
          { student: "David Wilson", overallGrade: 78, assignmentAvg: 75, examAvg: 82 },
        ];

        const mockTrendData: PerformanceTrendData[] = [
          { month: "Sep", avgGrade: 78 },
          { month: "Oct", avgGrade: 80 },
          { month: "Nov", avgGrade: 82 },
          { month: "Dec", avgGrade: 84 },
          { month: "Jan", avgGrade: 85 },
          { month: "Feb", avgGrade: 87 },
        ];

        setGradeData(mockGradeData);
        setCourseData(mockCourseData);
        setStudentData(mockStudentData);
        setTrendData(mockTrendData);
      } catch (err) {
        setError("Failed to load academic performance data");
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
            <h2 className="text-3xl font-bold text-foreground">Academic Performance Report</h2>
            <p className="text-muted-foreground mt-1">View student performance and grade distribution</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="this-semester">
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
              <CardTitle className="text-sm font-medium">Avg. Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Math.round(courseData.reduce((sum, course) => sum + course.avgGrade, 0) / courseData.length)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Overall Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Math.round(courseData.reduce((sum, course) => sum + course.passRate, 0) / courseData.length)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Performing Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {studentData.reduce((max, student) => student.overallGrade > max.overallGrade ? student : max, studentData[0]).student}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.max(...studentData.map(s => s.overallGrade))}% average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Best Performing Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {courseData.reduce((max, course) => course.avgGrade > max.avgGrade ? course : max, courseData[0]).course}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.max(...courseData.map(c => c.avgGrade))}% average
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Grade Distribution
              </CardTitle>
              <CardDescription>Distribution of final grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Course Performance
              </CardTitle>
              <CardDescription>Average grades by course</CardDescription>
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
                    <Bar dataKey="avgGrade" fill="#3b82f6" name="Average Grade" />
                  </BarChart>
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
                Performance Trend
              </CardTitle>
              <CardDescription>Average grades over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="avgGrade" 
                      stroke="#3b82f6" 
                      name="Average Grade" 
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
                <GraduationCap className="w-5 h-5" />
                Top Student Performers
              </CardTitle>
              <CardDescription>Comparison of top students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={studentData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="student" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Overall Grade" dataKey="overallGrade" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Radar name="Assignment Avg" dataKey="assignmentAvg" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Radar name="Exam Avg" dataKey="examAvg" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FacultyProtectedRoute>
  );
}