"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Search, Filter, Eye, Edit } from "lucide-react";
import { useFaculty } from "@/hooks/faculty/FacultyContext";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface StudentGrade {
  id: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignmentGrades: { [key: string]: number | string };
  totalGrade: number;
  letterGrade: string;
}

export default function FacultyGradebookPage() {
  const router = useRouter();
  const { state } = useFaculty();
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignments, setAssignments] = useState<string[]>([]);

  // In a real implementation, we would fetch gradebook data from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents([
        {
          id: 1,
          studentId: "S2024001",
          studentName: "Ahmed Khan",
          studentEmail: "ahmed.khan@student.university.edu",
          assignmentGrades: {
            "Assignment 1": 85,
            "Quiz 1": 90,
            "Midterm": 88,
            "Project": "-",
            "Final Exam": "-"
          },
          totalGrade: 87.5,
          letterGrade: "B+"
        },
        {
          id: 2,
          studentId: "S2024002",
          studentName: "Fatima Rahman",
          studentEmail: "fatima.r@student.university.edu",
          assignmentGrades: {
            "Assignment 1": 92,
            "Quiz 1": 88,
            "Midterm": 95,
            "Project": "-",
            "Final Exam": "-"
          },
          totalGrade: 91.5,
          letterGrade: "A-"
        }
      ]);
      setAssignments(["Assignment 1", "Quiz 1", "Midterm", "Project", "Final Exam"]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredStudents = students.filter(student => 
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gradebook</h1>
          <p className="text-muted-foreground">Manage and view student grades</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export Grades
          </Button>
          <Button className="gap-2">
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
                <Input 
                  placeholder="Search students..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter size={16} />
              </Button>
            </div>
          </div>
          <CardDescription>
            View and manage grades for all students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="mt-4">
                {searchTerm ? "No students found" : "No students enrolled"}
              </CardTitle>
              <CardDescription className="mt-2">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "There are no students enrolled in this course yet"}
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
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-accent/5">
                      <td className="py-3 px-2">
                        <div>
                          <div className="font-medium">{student.studentName}</div>
                          <div className="text-sm text-muted-foreground">{student.studentId}</div>
                        </div>
                      </td>
                      {assignments.map((assignment, index) => (
                        <td key={index} className="py-3 px-2 text-right">
                          <Input
                            type="text"
                            defaultValue={student.assignmentGrades[assignment] || "-"}
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
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push(`/faculty/students/${student.id}`)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => router.push(`/faculty/students/${student.id}/edit-grades`)}
                          >
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
    </FacultyProtectedRoute>
  );
}