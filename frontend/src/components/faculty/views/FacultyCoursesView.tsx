"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Settings, Users, Plus, FileText, BarChart3, MessageCircle, Video, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFacultyCourses } from "@/lib/faculty/api";

interface Course {
  id: number;
  code?: string;
  name?: string;
  semester?: string;
  students?: number;
  credits?: number;
  status?: string;
}

export function FacultyCoursesView() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getFacultyCourses();
        setCourses(data.courses || []);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Classes</h2>
          <p className="text-muted-foreground mt-1">Manage your active courses</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Create Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No courses found</CardTitle>
            <CardDescription className="mt-2">
              You haven&apos;t created any courses yet. Get started by creating your first course.
            </CardDescription>
            <Button className="mt-4 gap-2 bg-primary hover:bg-primary/90">
              <Plus size={16} />
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course: Course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <BookOpen size={20} className="text-primary" />
                      <CardTitle className="text-lg">{course.name || "Untitled Course"}</CardTitle>
                    </div>
                    <CardDescription className="mt-1">
                      {course.code || "No code"} • {course.credits || 0} Credits • {course.semester || "Unknown semester"}
                    </CardDescription>
                  </div>
                  <Badge>{course.status || "Draft"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-muted-foreground" />
                      <span>{course.students || 0} Students Enrolled</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {[
                      { label: "Syllabus", icon: "📄" },
                      { label: "Gradebook", icon: "📊" },
                      { label: "Assignments", icon: "📋" },
                      { label: "Discussion", icon: "💬" },
                    ].map((item, idx) => (
                      <div key={idx} className="rounded-lg bg-accent/5 p-2 flex items-center gap-2 text-center">
                        <span>{item.icon}</span>
                        <span className="text-xs">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => router.push(`/faculty/courses/${course.id}/edit`)}
                    >
                      <Settings size={16} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => router.push(`/faculty/courses/${course.id}/students`)}
                    >
                      <Users size={16} />
                      Manage Students
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => router.push(`/faculty/gradebook?courseId=${course.id}`)}
                    >
                      <BarChart3 size={16} />
                      Gradebook
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => router.push(`/faculty/assignments?courseId=${course.id}`)}
                    >
                      <FileText size={16} />
                      Assignments
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}