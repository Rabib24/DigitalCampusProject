'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getFacultyCourses } from '@/lib/faculty/api';
import { getCourseRoster } from '@/lib/faculty/roster';
import { Search, Download } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  enrollment_limit: number;
  studentCount: number;
}

interface Student {
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

const FacultyClassRosterView = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [roster, setRoster] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  // Fetch roster when a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchRoster(selectedCourse);
    } else {
      setRoster([]);
    }
  }, [selectedCourse]);

  const fetchRoster = async (courseId: string) => {
    setLoading(true);
    try {
      const response = await getCourseRoster(courseId);
      if (response.success) {
        setRoster(response.results || response.data || []);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to fetch class roster',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch class roster',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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

  const handleExportRoster = () => {
    if (!selectedCourse || roster.length === 0) {
      toast({
        title: 'Error',
        description: 'No roster data to export',
        variant: 'destructive',
      });
      return;
    }

    // Create CSV content
    const csvContent = [
      ['Student ID', 'Name', 'Email', 'Status', 'Grade'],
      ...roster.map(student => [
        student.student.student_id,
        `${student.student.user.first_name} ${student.student.user.last_name}`,
        student.student.user.email,
        student.status,
        student.grade || ''
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `roster_${selectedCourse}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Success',
      description: 'Class roster exported successfully',
    });
  };

  const filteredRoster = roster.filter(student => {
    const matchesSearch = 
      student.student.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Roster</CardTitle>
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
                  Showing {filteredRoster.length} of {roster.length} students
                </p>
              )}
            </div>
            <Button onClick={handleExportRoster} disabled={!selectedCourse || roster.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export Roster
            </Button>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoster.length > 0 ? (
                  filteredRoster.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.student.student_id}</TableCell>
                      <TableCell>
                        {student.student.user.first_name} {student.student.user.last_name}
                      </TableCell>
                      <TableCell>{student.student.user.email}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>{student.grade || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No students found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Please select a course to view the class roster</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyClassRosterView;