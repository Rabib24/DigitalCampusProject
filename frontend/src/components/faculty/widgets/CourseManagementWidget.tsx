"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Users } from "lucide-react";

interface Course {
  id: number;
  code: string;
  name: string;
  students: number;
  attendance: number;
}

export function CourseManagementWidget() {
  // This would normally come from an API call
  const courses: Course[] = [
    { id: 1, code: "CS-301", name: "Data Science", students: 32, attendance: 92 },
    { id: 2, code: "CS-401", name: "Capstone Project", students: 18, attendance: 94 },
    { id: 3, code: "CS-205", name: "Web Development", students: 45, attendance: 85 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            My Classes
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus size={16} />
            Create
          </Button>
        </div>
        <CardDescription>Manage your active courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5">
              <div>
                <div className="font-medium">{course.code}</div>
                <div className="text-sm text-muted-foreground">{course.name}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm">
                  <Users size={16} />
                  {course.students}
                </div>
                <div className="text-sm font-medium">{course.attendance}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}