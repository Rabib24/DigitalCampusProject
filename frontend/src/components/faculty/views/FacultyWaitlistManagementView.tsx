'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getFacultyCourses } from '@/lib/faculty/api';
import { getCourseWaitlist, manageWaitlist } from '@/lib/faculty/waitlist';
import { Search, Check, X } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  enrollment_limit: number;
  studentCount: number;
}

interface WaitlistEntry {
  id: string;
  student: {
    student_id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  created_at: string;
  position: number;
}

const FacultyWaitlistManagementView = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

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

  // Fetch waitlist when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchWaitlist(selectedCourse);
    } else {
      setWaitlist([]);
    }
  }, [selectedCourse]);

  const fetchWaitlist = async (courseId: string) => {
    setLoading(true);
    try {
      const response = await getCourseWaitlist(courseId);
      if (response.success) {
        setWaitlist(response.results || response.data || []);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to fetch waitlist',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch waitlist',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveStudents = async () => {
    if (!selectedCourse || selectedStudents.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one student to approve',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await manageWaitlist(selectedCourse, 'approve', selectedStudents);
      if (response.success) {
        toast({
          title: 'Success',
          description: response.message || 'Students approved successfully',
        });
        setSelectedStudents([]);
        fetchWaitlist(selectedCourse); // Refresh waitlist
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to approve students',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve students',
        variant: 'destructive',
      });
    }
  };

  const handleRejectStudents = async () => {
    if (!selectedCourse || selectedStudents.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one student to reject',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await manageWaitlist(selectedCourse, 'reject', selectedStudents);
      if (response.success) {
        toast({
          title: 'Success',
          description: response.message || 'Students rejected successfully',
        });
        setSelectedStudents([]);
        fetchWaitlist(selectedCourse); // Refresh waitlist
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to reject students',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject students',
        variant: 'destructive',
      });
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === waitlist.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(waitlist.map(entry => entry.student.student_id));
    }
  };

  const filteredWaitlist = waitlist.filter(entry => 
    entry.student.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.student.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              {selectedCourse && (
                <p className="text-sm text-muted-foreground">
                  Showing {filteredWaitlist.length} of {waitlist.length} waitlisted students
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleApproveStudents} 
                disabled={!selectedCourse || selectedStudents.length === 0}
                variant="default"
              >
                <Check className="mr-2 h-4 w-4" />
                Approve Selected
              </Button>
              <Button 
                onClick={handleRejectStudents} 
                disabled={!selectedCourse || selectedStudents.length === 0}
                variant="destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Reject Selected
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedCourse ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedStudents.length === waitlist.length && waitlist.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWaitlist.length > 0 ? (
                  filteredWaitlist.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(entry.student.student_id)}
                          onCheckedChange={() => toggleStudentSelection(entry.student.student_id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">#{entry.position}</Badge>
                      </TableCell>
                      <TableCell>{entry.student.student_id}</TableCell>
                      <TableCell>
                        {entry.student.user.first_name} {entry.student.user.last_name}
                      </TableCell>
                      <TableCell>{entry.student.user.email}</TableCell>
                      <TableCell>
                        {new Date(entry.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No students on the waitlist
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Please select a course to view the waitlist</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyWaitlistManagementView;