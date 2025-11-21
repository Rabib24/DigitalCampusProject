"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BarChart3, 
  Download, 
  Filter,
  Search,
  Eye,
  Edit
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentGrade {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignments: {
    id: string;
    title: string;
    points: number;
    maxPoints: number;
    letterGrade: string;
  }[];
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  letterGrade: string;
}

export function CourseGradebookPage({ courseId }: { courseId: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [grades, setGrades] = useState<StudentGrade[]>([
    {
      id: "grade_001",
      studentId: "student_001",
      studentName: "Alex Johnson",
      studentEmail: "a.johnson@university.edu",
      assignments: [
        { id: "assign_001", title: "Linked List", points: 95, maxPoints: 100, letterGrade: "A" },
        { id: "assign_002", title: "Sorting Analysis", points: 140, maxPoints: 150, letterGrade: "A-" },
        { id: "assign_003", title: "Midterm Exam", points: 180, maxPoints: 200, letterGrade: "A-" }
      ],
      totalPoints: 415,
      maxPoints: 450,
      percentage: 92.2,
      letterGrade: "A-"
    },
    {
      id: "grade_002",
      studentId: "student_002",
      studentName: "Sam Wilson",
      studentEmail: "s.wilson@university.edu",
      assignments: [
        { id: "assign_001", title: "Linked List", points: 85, maxPoints: 100, letterGrade: "B+" },
        { id: "assign_002", title: "Sorting Analysis", points: 130, maxPoints: 150, letterGrade: "B+" },
        { id: "assign_003", title: "Midterm Exam", points: 170, maxPoints: 200, letterGrade: "B+" }
      ],
      totalPoints: 385,
      maxPoints: 450,
      percentage: 85.6,
      letterGrade: "B+"
    },
    {
      id: "grade_003",
      studentId: "student_003",
      studentName: "Taylor Smith",
      studentEmail: "t.smith@university.edu",
      assignments: [
        { id: "assign_001", title: "Linked List", points: 90, maxPoints: 100, letterGrade: "A-" },
        { id: "assign_002", title: "Sorting Analysis", points: 145, maxPoints: 150, letterGrade: "A-" },
        { id: "assign_003", title: "Midterm Exam", points: 190, maxPoints: 200, letterGrade: "A" }
      ],
      totalPoints: 425,
      maxPoints: 450,
      percentage: 94.4,
      letterGrade: "A"
    }
  ]);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredGrades = grades.filter(grade => 
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gradebook</h1>
          <p className="text-muted-foreground mt-1">CS-203 Data Structures and Algorithms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Grades
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Student Grades</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            View and manage student grades for all assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Student</th>
                  <th className="text-left py-3 px-2">Email</th>
                  <th className="text-left py-3 px-2">Linked List (100 pts)</th>
                  <th className="text-left py-3 px-2">Sorting Analysis (150 pts)</th>
                  <th className="text-left py-3 px-2">Midterm Exam (200 pts)</th>
                  <th className="text-left py-3 px-2">Total</th>
                  <th className="text-left py-3 px-2">Grade</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <tr key={grade.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <div className="font-medium">{grade.studentName}</div>
                      <div className="text-sm text-muted-foreground">ID: {grade.studentId}</div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{grade.studentEmail}</td>
                    <td className="py-3 px-2">
                      <div className="font-medium">{grade.assignments[0].points}</div>
                      <div className="text-sm text-muted-foreground">{grade.assignments[0].letterGrade}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium">{grade.assignments[1].points}</div>
                      <div className="text-sm text-muted-foreground">{grade.assignments[1].letterGrade}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium">{grade.assignments[2].points}</div>
                      <div className="text-sm text-muted-foreground">{grade.assignments[2].letterGrade}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-medium">{grade.totalPoints}/{grade.maxPoints}</div>
                      <div className="text-sm text-muted-foreground">{grade.percentage.toFixed(1)}%</div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge className={getGradeColor(grade.letterGrade)}>
                        {grade.letterGrade}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Class Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class Average</span>
                <span className="font-medium">87.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Highest Grade</span>
                <span className="font-medium text-green-600">94.4% (A)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lowest Grade</span>
                <span className="font-medium text-red-600">85.6% (B+)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Students</span>
                <span className="font-medium">30</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">A Range (90-100)</span>
                <span className="font-medium">2 students</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "66%" }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">B Range (80-89)</span>
                <span className="font-medium">1 student</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "33%" }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">C Range (70-79)</span>
                <span className="font-medium">0 students</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Averages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Linked List Implementation</span>
                  <span>90.0%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Sorting Algorithms Analysis</span>
                  <span>88.3%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "88%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Midterm Exam</span>
                  <span>85.8%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "86%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}