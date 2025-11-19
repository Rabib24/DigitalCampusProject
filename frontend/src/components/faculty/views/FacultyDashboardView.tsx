"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BookOpen, Users, FileText, Video, BarChart3, PieChart, Calendar, MessageCircle, Loader2 } from "lucide-react";
import { getFacultyDashboardOverview } from "@/lib/faculty/api";

interface PendingAssignment {
  id: number;
  title: string;
  course: string;
}

interface DashboardOverview {
  activeClasses: number;
  totalStudents: number;
  pendingGrades: number;
  advisedStudents: number;
  attendanceRate: number;
  pendingAssignments: PendingAssignment[];
}

export function FacultyDashboardView() {
  const router = useRouter();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const data = await getFacultyDashboardOverview();
        setOverview(data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
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
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome back, Faculty!</h2>
        <p className="text-muted-foreground mt-1">Here&apos;s your teaching and advising overview</p>
      </div>

      {/* Alert Banner */}
      <Alert className="border-accent/50 bg-accent/5">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Pending Actions</AlertTitle>
        <AlertDescription>
          You have {overview?.pendingGrades || 0} ungraded assignments and 0 advising appointments scheduled this week.
        </AlertDescription>
      </Alert>

      {/* Teaching Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{overview?.activeClasses || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{overview?.totalStudents || 0} total students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{overview?.pendingGrades || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Assignments to grade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Advised Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{overview?.advisedStudents || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active advisees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{overview?.attendanceRate || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">Average across classes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Pending Grading
            </CardTitle>
            <CardDescription>Assignments awaiting grades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview?.pendingAssignments && overview.pendingAssignments.length > 0 ? (
              <div className="space-y-3">
                {overview.pendingAssignments.map((assignment: PendingAssignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    </div>
                    <Button size="sm">Grade</Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12" />
                <p className="mt-2">No pending assignments to grade</p>
              </div>
            )}
            <Button className="w-full bg-primary hover:bg-primary/90" disabled={!overview?.pendingAssignments || overview.pendingAssignments.length === 0}>
              Grade Assignments
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-transparent"
              onClick={() => router.push('/faculty/assignments')}
            >
              <BookOpen size={16} />
              Create Assignment
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-transparent"
              onClick={() => router.push('/faculty/advising')}
            >
              <Users size={16} />
              Schedule Advising
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-transparent"
              onClick={() => router.push('/faculty/recordings')}
            >
              <Video size={16} />
              Start Recording
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-transparent"
              onClick={() => router.push('/faculty/analytics')}
            >
              <BarChart3 size={16} />
              View Analytics
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-transparent"
              onClick={() => router.push('/faculty/schedule')}
            >
              <Calendar size={16} />
              Schedule Class
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-transparent"
              onClick={() => router.push('/faculty/announcements')}
            >
              <MessageCircle size={16} />
              Send Announcement
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Classes Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Classes (This Semester)</CardTitle>
          <CardDescription>You are teaching {overview?.activeClasses || 0} courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12" />
            <p className="mt-2">No active classes found</p>
            <p className="text-sm mt-1">Create your first course to get started</p>
            <Button className="mt-4 gap-2 bg-primary hover:bg-primary/90">
              <BookOpen size={16} />
              Create Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}