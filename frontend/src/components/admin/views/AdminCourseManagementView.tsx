"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, BookOpen } from "lucide-react";

export function AdminCourseManagementView() {
  const courses = [
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      department: "Computer Science",
      instructor: "Dr. Jane Smith",
      credits: 3,
      students: 120,
      status: "active",
    },
    {
      id: "MATH201",
      name: "Calculus II",
      department: "Mathematics",
      instructor: "Dr. Robert Johnson",
      credits: 4,
      students: 85,
      status: "active",
    },
    {
      id: "PHYS301",
      name: "Quantum Mechanics",
      department: "Physics",
      instructor: "Dr. Emily Davis",
      credits: 3,
      students: 45,
      status: "active",
    },
    {
      id: "BIO101",
      name: "Introduction to Biology",
      department: "Biology",
      instructor: "Dr. Michael Wilson",
      credits: 3,
      students: 150,
      status: "pending",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">
          Manage courses, instructors, and enrollment across departments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Course Directory</CardTitle>
              <CardDescription>
                View and manage all courses in the system.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course ID</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.id}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.students}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Summary</CardTitle>
            <CardDescription>
              Course distribution across departments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { department: "Computer Science", courses: 24, students: 850 },
                { department: "Mathematics", courses: 18, students: 620 },
                { department: "Physics", courses: 15, students: 480 },
                { department: "Biology", courses: 20, students: 720 },
                { department: "Chemistry", courses: 16, students: 580 },
              ].map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{dept.department}</p>
                    <p className="text-xs text-muted-foreground">{dept.courses} courses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{dept.students} students</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common course management tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Import Courses from CSV
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Export Course Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Bulk Update Course Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}