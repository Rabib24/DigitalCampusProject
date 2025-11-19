"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, BarChart3, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface CourseUtilizationData {
  course: string;
  enrolled: number;
  completed: number;
  resourceViews: number;
  avgTimeSpent: number;
}

interface ResourceUsageData {
  resourceName: string;
  views: number;
  uniqueUsers: number;
}

interface EngagementTrendData {
  week: string;
  engagement: number;
}

export default function CourseUtilizationReportPage() {
  const [courseData, setCourseData] = useState<CourseUtilizationData[]>([]);
  const [resourceData, setResourceData] = useState<ResourceUsageData[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock data - in a real implementation, this would come from an API
        const mockCourseData: CourseUtilizationData[] = [
          { course: "CS-101", enrolled: 120, completed: 110, resourceViews: 2450, avgTimeSpent: 45 },
          { course: "CS-205", enrolled: 95, completed: 88, resourceViews: 1890, avgTimeSpent: 52 },
          { course: "CS-301", enrolled: 78, completed: 72, resourceViews: 1650, avgTimeSpent: 68 },
          { course: "CS-401", enrolled: 65, completed: 60, resourceViews: 1420, avgTimeSpent: 75 },
        ];

        const mockResourceData: ResourceUsageData[] = [
          { resourceName: "Lecture 1 - Introduction", views: 320, uniqueUsers: 115 },
          { resourceName: "Lecture 2 - Fundamentals", views: 298, uniqueUsers: 108 },
          { resourceName: "Assignment 1", views: 275, uniqueUsers: 95 },
          { resourceName: "Lecture 3 - Advanced Concepts", views: 240, uniqueUsers: 88 },
          { resourceName: "Quiz 1", views: 220, uniqueUsers: 82 },
        ];

        const mockEngagementData: EngagementTrendData[] = [
          { week: "Week 1", engagement: 78 },
          { week: "Week 2", engagement: 82 },
          { week: "Week 3", engagement: 85 },
          { week: "Week 4", engagement: 87 },
          { week: "Week 5", engagement: 89 },
          { week: "Week 6", engagement: 91 },
          { week: "Week 7", engagement: 93 },
          { week: "Week 8", engagement: 95 },
        ];

        setCourseData(mockCourseData);
        setResourceData(mockResourceData);
        setEngagementData(mockEngagementData);
      } catch (err) {
        setError("Failed to load course utilization data");
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
            <h2 className="text-3xl font-bold text-foreground">Course Utilization Report</h2>
            <p className="text-muted-foreground mt-1">View course engagement and resource usage metrics</p>
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
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{courseData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active this semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Math.round(courseData.reduce((sum, course) => sum + course.enrolled, 0) / courseData.length)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Students per course</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Resource Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {resourceData.reduce((sum, resource) => sum + resource.views, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. Time Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Math.round(courseData.reduce((sum, course) => sum + course.avgTimeSpent, 0) / courseData.length)} min
              </div>
              <p className="text-xs text-muted-foreground mt-1">Per student</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Course Enrollment & Completion
              </CardTitle>
              <CardDescription>Enrollment vs completion rates by course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="course" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled" />
                    <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Resource Usage
              </CardTitle>
              <CardDescription>Top resources by views</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="resourceName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8b5cf6" name="Views" />
                    <Bar dataKey="uniqueUsers" fill="#ec4899" name="Unique Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Engagement Trend
            </CardTitle>
            <CardDescription>Weekly engagement across all courses</CardDescription>
            </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#3b82f6" 
                    name="Engagement %" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </FacultyProtectedRoute>
  );
}