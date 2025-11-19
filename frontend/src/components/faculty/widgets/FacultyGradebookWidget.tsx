"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Eye } from "lucide-react";

interface CourseGrade {
  id: number;
  course: string;
  students: number;
  averageGrade: number;
  pendingGrades: number;
}

export function FacultyGradebookWidget() {
  // This would normally come from an API call
  const courses: CourseGrade[] = [
    { id: 1, course: "CS-301", students: 32, averageGrade: 85.5, pendingGrades: 5 },
    { id: 2, course: "CS-401", students: 18, averageGrade: 88.2, pendingGrades: 3 },
    { id: 3, course: "CS-205", students: 45, averageGrade: 79.8, pendingGrades: 12 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Gradebook Overview
          </CardTitle>
          <Button size="sm" variant="outline">
            <Eye size={16} />
          </Button>
        </div>
        <CardDescription>Student performance across courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5">
              <div>
                <div className="font-medium">{course.course}</div>
                <div className="text-sm text-muted-foreground">{course.students} students</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm">
                  Avg: <span className="font-medium">{course.averageGrade.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-destructive">
                  {course.pendingGrades > 0 && (
                    <>
                      <span>{course.pendingGrades} pending</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}