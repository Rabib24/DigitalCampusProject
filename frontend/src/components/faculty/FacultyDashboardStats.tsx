"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  FileText, 
  Clock,
  BarChart3,
  LineChart,
  PieChart
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

interface FacultyDashboardStatsProps {
  courseStats: {
    totalCourses: number;
    activeCourses: number;
    completedCourses: number;
  };
  studentStats: {
    totalStudents: number;
    activeStudents: number;
    graduatedStudents: number;
  };
  assignmentStats: {
    totalAssignments: number;
    pendingGrading: number;
    completedAssignments: number;
  };
  researchStats: {
    totalProjects: number;
    activeProjects: number;
    publications: number;
  };
}

const StatCard = ({ title, value, change, icon, trend = "neutral", description }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={`text-xs ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default function FacultyDashboardStats({
  courseStats,
  studentStats,
  assignmentStats,
  researchStats
}: FacultyDashboardStatsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Academic Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Courses"
            value={courseStats.totalCourses}
            change={5}
            trend="up"
            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
            description="All courses taught"
          />
          <StatCard
            title="Active Students"
            value={studentStats.activeStudents}
            change={-2}
            trend="down"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            description="Currently enrolled"
          />
          <StatCard
            title="Pending Assignments"
            value={assignmentStats.pendingGrading}
            change={-15}
            trend="down"
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
            description="Awaiting grading"
          />
          <StatCard
            title="Active Projects"
            value={researchStats.activeProjects}
            change={10}
            trend="up"
            icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            description="Ongoing research"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Performance Analytics</h2>
          <div className="flex gap-2">
            <Badge variant="secondary">Monthly</Badge>
            <Badge variant="outline">Quarterly</Badge>
            <Badge variant="outline">Yearly</Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Student Performance Trend
              </CardTitle>
              <CardDescription>
                Average grades across all courses over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/10 rounded-lg">
                <div className="text-center">
                  <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    Performance trend visualization would appear here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Showing grade trends over the last 6 months
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Course Distribution
              </CardTitle>
              <CardDescription>
                Student enrollment across courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/10 rounded-lg">
                <div className="text-center">
                  <PieChart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    Course distribution visualization would appear here
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Showing enrollment distribution
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div>
                    <p className="text-sm font-medium">Assignment 3 Submission</p>
                    <p className="text-xs text-muted-foreground">CS-205 • Tomorrow</p>
                  </div>
                  <Badge variant="destructive">High</Badge>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div>
                    <p className="text-sm font-medium">Grade Review Meeting</p>
                    <p className="text-xs text-muted-foreground">CS-301 • 3 days</p>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-muted rounded">
                  <div>
                    <p className="text-sm font-medium">Research Proposal</p>
                    <p className="text-xs text-muted-foreground">Project Alpha • 1 week</p>
                  </div>
                  <Badge variant="outline">Low</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Metrics Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Student Engagement</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Attendance Rate</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assignment Submission</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Forum Participation</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Course Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Grade</span>
                      <span className="font-medium">B+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pass Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retake Requests</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Research Impact</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Publications</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Citations</span>
                      <span className="font-medium">245</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collaborations</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}