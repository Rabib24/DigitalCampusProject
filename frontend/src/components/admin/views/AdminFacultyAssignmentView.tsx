"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertCircle,
  Users,
  BookOpen
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminFacultyAssignmentService, type Faculty, type Course, type CourseWithFaculty, type AssignFacultyData } from "@/lib/admin/faculty-assignment";

export function AdminFacultyAssignmentView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [facultyMembers, setFacultyMembers] = useState<Faculty[]>([]);
  const [courseFaculties, setCourseFaculties] = useState<CourseWithFaculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState("");

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // In a real implementation, we would fetch actual data
      // For now, we'll use mock data to demonstrate the UI
      
      // Mock courses data
      const mockCourses: Course[] = [
        {
          id: "CS101",
          code: "CS101",
          name: "Introduction to Computer Science",
          department: "Computer Science",
          credits: 3,
          instructor_id: "",
          enrollment_limit: 30,
          start_date: "2024-01-15",
          end_date: "2024-05-15"
        },
        {
          id: "MATH201",
          code: "MATH201",
          name: "Calculus II",
          department: "Mathematics",
          credits: 4,
          instructor_id: "",
          enrollment_limit: 25,
          start_date: "2024-01-15",
          end_date: "2024-05-15"
        },
        {
          id: "PHYS102",
          code: "PHYS102",
          name: "General Physics II",
          department: "Physics",
          credits: 4,
          instructor_id: "",
          enrollment_limit: 20,
          start_date: "2024-01-15",
          end_date: "2024-05-15"
        }
      ];
      
      // Mock faculty data
      const mockFaculty: Faculty[] = [
        {
          employee_id: "EMP001",
          first_name: "Jane",
          last_name: "Smith",
          department: "Computer Science",
          title: "Professor",
          email: "jane.smith@university.edu"
        },
        {
          employee_id: "EMP002",
          first_name: "Robert",
          last_name: "Johnson",
          department: "Mathematics",
          title: "Associate Professor",
          email: "robert.johnson@university.edu"
        },
        {
          employee_id: "EMP003",
          first_name: "Emily",
          last_name: "Davis",
          department: "Physics",
          title: "Assistant Professor",
          email: "emily.davis@university.edu"
        }
      ];
      
      setCourses(mockCourses);
      setFacultyMembers(mockFaculty);
      
      // Mock course-faculty assignments
      const mockCourseFaculties: CourseWithFaculty[] = [
        {
          course_id: "CS101",
          course_code: "CS101",
          course_name: "Introduction to Computer Science",
          assigned_faculty: {
            faculty_id: "EMP001",
            faculty_name: "Jane Smith",
            department: "Computer Science",
            title: "Professor"
          }
        },
        {
          course_id: "MATH201",
          course_code: "MATH201",
          course_name: "Calculus II",
          assigned_faculty: null
        },
        {
          course_id: "PHYS102",
          course_code: "PHYS102",
          course_name: "General Physics II",
          assigned_faculty: {
            faculty_id: "EMP003",
            faculty_name: "Emily Davis",
            department: "Physics",
            title: "Assistant Professor"
          }
        }
      ];
      
      setCourseFaculties(mockCourseFaculties);
    } catch (err) {
      setError("Failed to load data");
      console.error("Data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignFaculty = async () => {
    if (!selectedCourseId || !selectedFacultyId) {
      setError("Please select both a course and a faculty member");
      return;
    }
    
    try {
      const data: AssignFacultyData = {
        course_id: selectedCourseId,
        faculty_id: selectedFacultyId
      };
      
      await AdminFacultyAssignmentService.assignFacultyToCourse(data);
      
      // Update local state to reflect the assignment
      const updatedCourseFaculties = courseFaculties.map(courseFaculty => {
        if (courseFaculty.course_id === selectedCourseId) {
          const faculty = facultyMembers.find(f => f.employee_id === selectedFacultyId);
          return {
            ...courseFaculty,
            assigned_faculty: faculty ? {
              faculty_id: faculty.employee_id,
              faculty_name: `${faculty.first_name} ${faculty.last_name}`,
              department: faculty.department,
              title: faculty.title
            } : null
          };
        }
        return courseFaculty;
      });
      
      setCourseFaculties(updatedCourseFaculties);
      setSelectedCourseId("");
      setSelectedFacultyId("");
    } catch (err) {
      setError("Failed to assign faculty to course");
      console.error("Assign faculty error:", err);
    }
  };

  const handleRemoveFaculty = async (courseId: string) => {
    try {
      await AdminFacultyAssignmentService.removeFacultyFromCourse(courseId);
      
      // Update local state to reflect the removal
      const updatedCourseFaculties = courseFaculties.map(courseFaculty => {
        if (courseFaculty.course_id === courseId) {
          return {
            ...courseFaculty,
            assigned_faculty: null
          };
        }
        return courseFaculty;
      });
      
      setCourseFaculties(updatedCourseFaculties);
    } catch (err) {
      setError("Failed to remove faculty from course");
      console.error("Remove faculty error:", err);
    }
  };

  const filteredCourseFaculties = courseFaculties.filter(courseFaculty => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      courseFaculty.course_code.toLowerCase().includes(term) ||
      courseFaculty.course_name.toLowerCase().includes(term) ||
      (courseFaculty.assigned_faculty && 
        (courseFaculty.assigned_faculty.faculty_name.toLowerCase().includes(term) ||
         courseFaculty.assigned_faculty.department.toLowerCase().includes(term)))
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faculty Assignment Management</h1>
        <p className="text-muted-foreground">
          Assign faculty members to courses and manage teaching assignments.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assign Faculty to Course</CardTitle>
          <CardDescription>
            Select a course and faculty member to create a teaching assignment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="faculty">Faculty Member</Label>
              <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
                <SelectTrigger id="faculty">
                  <SelectValue placeholder="Select a faculty member" />
                </SelectTrigger>
                <SelectContent>
                  {facultyMembers.map((faculty) => (
                    <SelectItem key={faculty.employee_id} value={faculty.employee_id}>
                      {faculty.first_name} {faculty.last_name} ({faculty.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleAssignFaculty} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Assign Faculty
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Course Faculty Assignments</h2>
          <p className="text-muted-foreground">
            View and manage all faculty-course assignments.
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses or faculty..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Assigned Faculty</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourseFaculties.map((courseFaculty) => (
                <TableRow key={courseFaculty.course_id}>
                  <TableCell>
                    <div className="font-medium">{courseFaculty.course_code}</div>
                    <div className="text-sm text-muted-foreground">{courseFaculty.course_name}</div>
                  </TableCell>
                  <TableCell>
                    {courseFaculty.assigned_faculty ? (
                      <div>
                        <div className="font-medium">
                          {courseFaculty.assigned_faculty.faculty_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {courseFaculty.assigned_faculty.title}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No faculty assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {courseFaculty.assigned_faculty?.department || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {courseFaculty.assigned_faculty ? (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveFaculty(courseFaculty.course_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedCourseId(courseFaculty.course_id);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredCourseFaculties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No course faculty assignments found. {searchTerm ? "Try a different search term." : "Assign faculty to courses to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses.length}</div>
            <p className="text-muted-foreground">Courses in the system</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Total Faculty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{facultyMembers.length}</div>
            <p className="text-muted-foreground">Faculty members available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}