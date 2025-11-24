"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Search, UserPlus } from "lucide-react";
import { getAdminStudentManagement } from "@/lib/admin/api";

interface Student {
  student_id: string;
  user: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  degree_program: string;
  advisor_id: string;
  graduation_date: string;
  cumulative_gpa: number;
}

export function AdminStudentManagementView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminStudentManagement();
      setStudents(data.students || []);
      setFilteredStudents(data.students || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load student data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = students.filter(student => 
        student.user.first_name.toLowerCase().includes(term) ||
        student.user.last_name.toLowerCase().includes(term) ||
        student.user.username.toLowerCase().includes(term) ||
        student.student_id.toLowerCase().includes(term) ||
        student.degree_program.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <p>Loading student data...</p>
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
        <h1 className="text-3xl font-bold">Student Management</h1>
        <p className="text-muted-foreground">
          View and manage student records
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
          <CardDescription>
            Search and view student information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Degree Program</TableHead>
                <TableHead>GPA</TableHead>
                <TableHead>Graduation Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">{student.student_id}</TableCell>
                  <TableCell>{student.user.first_name} {student.user.last_name}</TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell>{student.degree_program || "Not specified"}</TableCell>
                  <TableCell>{student.cumulative_gpa ? student.cumulative_gpa.toFixed(2) : "N/A"}</TableCell>
                  <TableCell>
                    {student.graduation_date 
                      ? new Date(student.graduation_date).toLocaleDateString() 
                      : "Not set"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No students found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}