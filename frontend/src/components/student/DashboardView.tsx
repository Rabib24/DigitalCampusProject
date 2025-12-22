"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getUserData } from "@/lib/auth";
import EnrollmentPeriodNotification from "./EnrollmentPeriodNotification";

interface DashboardData {
  cgpa: number;
  completedCourses: number;
  remainingCourses: number;
  predictedGraduation: string;
  attendanceRate: number;
}

interface EnrolledCourse {
  id: string;
  code: string;
  name: string;
  progress?: number;
}

export function DashboardView() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch actual dashboard data from the backend
        const response = await apiGet('/student/dashboard');
        const data = await response.json();

        setDashboardData(data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setCoursesLoading(true);
        // Fetch enrolled courses from the backend
        const response = await apiGet('/student/courses');
        const data = await response.json();
        
        // Take only first 5 courses for dashboard display
        const coursesToShow = data.slice(0, 5).map((course: any) => ({
          id: course.id,
          code: course.code,
          name: course.name,
          progress: course.progress || 0,
        }));
        
        setEnrolledCourses(coursesToShow);
      } catch (err) {
        console.error("Enrolled courses fetch error:", err);
        // Don't set error state here, let dashboard still load
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const user = getUserData();
  console.log(user);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Welcome back, {user?.first_name}!</h2>
        <p className="text-muted-foreground mt-1">Here&apos;s your academic overview</p>
      </div>

      <EnrollmentPeriodNotification />

      {/* Alert Banner */}
      <div className="flex items-start gap-3 rounded-lg border border-accent/50 bg-accent/5 px-4 py-3 text-sm">
        <div className="mt-0.5 h-4 w-4 rounded-full border border-accent" />
        <div>
          <p className="font-semibold">Important Reminder</p>
          <p className="text-muted-foreground">
            Your CGPA is {dashboardData?.cgpa}. You have 2 pending assignments due this week.
          </p>
        </div>
      </div>

      {/* Academic Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 pt-4 pb-2">
            <p className="text-sm font-medium">Current CGPA</p>
          </div>
          <div className="px-4 py-4">
            <div className="text-3xl font-bold text-primary">{dashboardData?.cgpa}</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 0.05 from last semester</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 pt-4 pb-2">
            <p className="text-sm font-medium">Completed Courses</p>
          </div>
          <div className="px-4 py-4">
            <div className="text-3xl font-bold text-primary">{dashboardData?.completedCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">{dashboardData?.remainingCourses} remaining</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 pt-4 pb-2">
            <p className="text-sm font-medium">Predicted Graduation</p>
          </div>
          <div className="px-4 py-4">
            <div className="text-2xl font-bold text-primary">{dashboardData?.predictedGraduation}</div>
            <p className="text-xs text-muted-foreground mt-1">On track</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 pt-4 pb-2">
            <p className="text-sm font-medium">Attendance Rate</p>
          </div>
          <div className="px-4 py-4">
            <div className="text-3xl font-bold text-primary">{dashboardData?.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent</p>
          </div>
        </div>
      </div>

      {/* Quick Actions and Upcoming */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Next Assignment */}
        <div className="rounded-lg border bg-card lg:col-span-2">
          <div className="border-b px-4 pt-4 pb-2">
            <h3 className="text-sm font-semibold">Next Assignment</h3>
            <p className="text-xs text-muted-foreground">Due soon</p>
          </div>
          <div className="px-4 py-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <h4 className="font-semibold text-foreground">Data Structures Project</h4>
                  <p className="text-sm text-muted-foreground mt-1">CS-203 • Due in 2 days</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  Urgent
                </span>
              </div>
              <div className="flex items-start justify-between rounded-lg border border-border p-3">
                <div>
                  <h4 className="font-semibold text-foreground">Essay: Global Economics</h4>
                  <p className="text-sm text-muted-foreground mt-1">EC-101 • Due in 5 days</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                  Pending
                </span>
              </div>
            </div>
            <button
              type="button"
              className="w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
              onClick={() => {
                const event = new CustomEvent("viewChange", { detail: "assignments" });
                window.dispatchEvent(event);
              }}
            >
              View All Assignments
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-lg border bg-card">
          <div className="border-b px-4 pt-4 pb-2">
            <h3 className="text-base font-semibold">Quick Links</h3>
          </div>
          <div className="px-4 py-4 space-y-2">
            <button
              type="button"
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
            >
              <span className="h-6 w-6 rounded-md bg-accent text-[10px] flex items-center justify-center font-semibold">
                CS
              </span>
              <span>Class Schedule</span>
            </button>
            <button
              type="button"
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
            >
              <span className="h-6 w-6 rounded-md bg-accent text-[10px] flex items-center justify-center font-semibold">
                CM
              </span>
              <span>Course Materials</span>
            </button>
            <button
              type="button"
              className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
            >
              <span className="h-6 w-6 rounded-md bg-accent text-[10px] flex items-center justify-center font-semibold">
                EC
              </span>
              <span>Emergency Contacts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-4 pt-4 pb-2">
          <h3 className="text-base font-semibold">Enrolled Courses (This Semester)</h3>
          <p className="text-xs text-muted-foreground">
            {coursesLoading ? "Loading..." : `You are enrolled in ${enrolledCourses.length} course${enrolledCourses.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="px-4 py-4">
          {coursesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">Loading courses...</div>
            </div>
          ) : enrolledCourses.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">No courses enrolled</div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {enrolledCourses.map((course) => (
                <button
                  key={course.id}
                  type="button"
                  className="rounded-lg border border-border p-3 text-left hover:bg-accent/5 transition-colors"
                  onClick={() => router.push(`/student?view=courses`)}
                >
                  <h4 className="font-semibold text-sm">{course.code}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{course.name}</p>
                  {course.progress !== undefined && course.progress > 0 && (
                    <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}