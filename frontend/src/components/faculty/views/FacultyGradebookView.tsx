"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Download, Search, Filter, Eye, Edit, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFacultyGradebook } from "@/lib/faculty/api";

interface StudentGrade {
  id: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignmentGrades: { [key: string]: number | string };
  totalGrade: number;
  letterGrade: string;
}

interface CourseInfo {
  code: string;
  name: string;
  credits: number;
  semester: string;
}

export function FacultyGradebookView() {
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<string[]>([]);
  
  const courseInfo: CourseInfo = {
    code: "CS-301",
    name: "Data Science and Machine Learning",
    credits: 3,
    semester: "Fall 2024"
  };

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would get the course ID from route params
        const courseId = 1; // Placeholder
        const data = await getFacultyGradebook(courseId);
        setStudents(data.students || []);
        setAssignments(data.assignments || ["Assignment 1", "Quiz 1", "Midterm", "Project", "Final Exam"]);
      } catch (err) {
        setError("Failed to load gradebook");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGradebook();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Gradebook</h2>
          <p className="text-muted-foreground mt-1">
            {courseInfo.code} - {courseInfo.name} ({courseInfo.semester})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Grades
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <BarChart3 size={16} />
            Analytics
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Student Grades</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-8" />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
          <CardDescription>
            Manage and view student grades for all assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="mt-4">No students enrolled</CardTitle>
              <CardDescription className="mt-2">
                There are no students enrolled in this course yet.
              </CardDescription>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Student</th>
                    {assignments.map((assignment, index) => (
                      <th key={index} className="text-right py-3 px-2 text-sm font-medium">
                        {assignment}
                      </th>
                    ))}
                    <th className="text-right py-3 px-2 text-sm font-medium">Total</th>
                    <th className="text-center py-3 px-2 text-sm font-medium">Grade</th>
                    <th className="text-center py-3 px-2 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-accent/5">
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium">{student.studentName}</div>
                          <div className="text-sm text-muted-foreground">{student.studentId}</div>
                        </div>
                      </td>
                      {assignments.map((_, index) => (
                        <td key={index} className="py-3 px-2 text-right">
                          <Input
                            type="text"
                            defaultValue={student.assignmentGrades[assignments[index]] || "-"}
                            className="w-20 text-right"
                          />
                        </td>
                      ))}
                      <td className="py-3 px-2 text-right font-medium">
                        {student.totalGrade.toFixed(1)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant="secondary">{student.letterGrade}</Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}