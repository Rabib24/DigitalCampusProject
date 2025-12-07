'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

import { getFacultyCourses } from '@/lib/faculty/api';
import { getCourseEnrollments, manageCourseEnrollment } from '@/lib/faculty/enrollment';
import { Search, Plus, Trash2, UserPlus } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  enrollment_limit: number;
  studentCount: number;
}

interface Enrollment {
  id: string;
  student: {
    student_id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  status: string;
  grade?: string;
  created_at: string;
}

const FacultyEnrollmentManagementView = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState<boolean>(false);
  const [newStudentId, setNewStudentId] = useState<string>('');

  // Fetch faculty courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getFacultyCourses();
        if (response.success) {
          setCourses(response.courses || []);
        } else {
          toast({
            title: 'Error',
            description: response.message || 'Failed to fetch courses',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch courses',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch enrollments when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchEnrollments(selectedCourse);
    } else {
      setEnrollments([]);
    }
  }, [selectedCourse]);

  const fetchEnrollments = async (courseId: string) => {
    setLoading(true);
    try {
      const response = await getCourseEnrollments(courseId);
      if (response.success) {
        setEnrollments(response.results || response.data || []);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to fetch enrollments',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch enrollments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedCourse || !newStudentId) {
      toast({
        title: 'Error',
        description: 'Please select a course and enter a student ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await manageCourseEnrollment(selectedCourse, 'add', newStudentId);
      if (response.success) {
        toast({
          title: 'Success',
          description: response.message || 'Student added successfully',
        });
        setIsAddStudentDialogOpen(false);
        setNewStudentId('');
        fetchEnrollments(selectedCourse); // Refresh enrollments
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to add student',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add student',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (!selectedCourse) return;

    try {
      const response = await manageCourseEnrollment(selectedCourse, 'remove', studentId);
      if (response.success) {
        toast({
          title: 'Success',
          description: response.message || 'Student removed successfully',
        });
        fetchEnrollments(selectedCourse); // Refresh enrollments
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to remove student',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove student',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'waitlisted':
        return <Badge variant="secondary">Waitlisted</Badge>;
      case 'dropped':
        return <Badge variant="destructive">Dropped</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = 
      enrollment.student.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.student.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || enrollment.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Course Enrollment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="course-select">Select Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger id="course-select">
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
            
            <div>
              <Label htmlFor="search">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              {selectedCourse && (
                <p className="text-sm text-muted-foreground">
                  Showing {filteredEnrollments.length} of {enrollments.length} students
                </p>
              )}
            </div>
            <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!selectedCourse}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Student to Course</DialogTitle>
                  <DialogDescription>
                    Enter the student ID to add them to the selected course.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student-id" className="text-right">
                      Student ID
                    </Label>
                    <Input
                      id="student-id"
                      value={newStudentId}
                      onChange={(e) => setNewStudentId(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddStudent}>Add Student</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedCourse ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>{enrollment.student.student_id}</TableCell>
                      <TableCell>
                        {enrollment.student.user.first_name} {enrollment.student.user.last_name}
                      </TableCell>
                      <TableCell>{enrollment.student.user.email}</TableCell>
                      <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                      <TableCell>{enrollment.grade || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveStudent(enrollment.student.student_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Please select a course to view enrollments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyEnrollmentManagementView;