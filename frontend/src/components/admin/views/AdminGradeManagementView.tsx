"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Plus, RefreshCw, Save } from "lucide-react";
import { getAdminGradeManagement, saveGrade } from "@/lib/admin/api";

interface Grade {
  id: string;
  student_id: string;
  course_id: string;
  assignment_id: string;
  value: number;
  max_points: number;
  letter_grade: string;
  grader_id: string;
  created_at: string;
}

export function AdminGradeManagementView() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const [assignmentId, setAssignmentId] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [maxPoints, setMaxPoints] = useState<string>("");
  const [letterGrade, setLetterGrade] = useState<string>("");

  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminGradeManagement();
      setGrades(data.grades || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load grade data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleSaveGrade = async () => {
    if (!studentId || !courseId || !value || !maxPoints) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      await saveGrade({
        student_id: studentId,
        course_id: courseId,
        assignment_id: assignmentId || null,
        value: parseFloat(value),
        max_points: parseFloat(maxPoints),
        letter_grade: letterGrade,
      });
      
      // Refresh data
      fetchGrades();
      
      // Reset form
      setStudentId("");
      setCourseId("");
      setAssignmentId("");
      setValue("");
      setMaxPoints("");
      setLetterGrade("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save grade";
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p>Loading grade data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grade Management</h1>
        <p className="text-muted-foreground">
          Manage student grades and academic records
        </p>
      </div>

      <Card className="border border-border bg-dashboard-card hover:bg-dashboard-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle>Add/Edit Grade</CardTitle>
          <CardDescription>
            Create or update student grades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseId">Course ID *</Label>
              <Input
                id="courseId"
                placeholder="Course ID"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignmentId">Assignment ID</Label>
              <Input
                id="assignmentId"
                placeholder="Assignment ID (optional)"
                value={assignmentId}
                onChange={(e) => setAssignmentId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Points Earned *</Label>
              <Input
                id="value"
                type="number"
                placeholder="Points earned"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxPoints">Maximum Points *</Label>
              <Input
                id="maxPoints"
                type="number"
                placeholder="Maximum points"
                value={maxPoints}
                onChange={(e) => setMaxPoints(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="letterGrade">Letter Grade</Label>
              <Input
                id="letterGrade"
                placeholder="Letter grade (A, B, C, etc.)"
                value={letterGrade}
                onChange={(e) => setLetterGrade(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleSaveGrade} className="bg-sidebar-active hover:bg-sidebar-active/90">
            <Save className="h-4 w-4 mr-2" />
            Save Grade
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-border bg-dashboard-card hover:bg-dashboard-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle>Recent Grades</CardTitle>
          <CardDescription>
            View and manage recent grade records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Course ID</TableHead>
                <TableHead>Assignment ID</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Letter Grade</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.student_id}</TableCell>
                  <TableCell>{grade.course_id}</TableCell>
                  <TableCell>{grade.assignment_id || "N/A"}</TableCell>
                  <TableCell>{grade.value} / {grade.max_points}</TableCell>
                  <TableCell>{grade.letter_grade}</TableCell>
                  <TableCell>{new Date(grade.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}