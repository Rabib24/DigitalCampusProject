"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Users } from "lucide-react";

export function AdminFacultyAssignmentView() {
  const facultyAssignments = [
    {
      id: 1,
      name: "Dr. Jane Smith",
      department: "Computer Science",
      courses: ["CS101", "CS201", "CS301"],
      workload: 12,
      status: "active",
    },
    {
      id: 2,
      name: "Dr. Robert Johnson",
      department: "Mathematics",
      courses: ["MATH101", "MATH201"],
      workload: 9,
      status: "active",
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      department: "Physics",
      courses: ["PHYS101"],
      workload: 6,
      status: "on-leave",
    },
    {
      id: 4,
      name: "Dr. Michael Wilson",
      department: "Biology",
      courses: ["BIO101", "BIO201", "BIO301", "BIO401"],
      workload: 15,
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faculty Assignment</h1>
        <p className="text-muted-foreground">
          Manage faculty course assignments and workload distribution.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Faculty Assignments</CardTitle>
              <CardDescription>
                View and manage faculty course assignments.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search faculty..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Assign Faculty
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Workload (hrs)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facultyAssignments.map((faculty) => (
                <TableRow key={faculty.id}>
                  <TableCell className="font-medium">{faculty.name}</TableCell>
                  <TableCell>{faculty.department}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {faculty.courses.map((course, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{faculty.workload}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        faculty.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {faculty.status}
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
            <CardTitle>Department Workload Distribution</CardTitle>
            <CardDescription>
              Workload distribution across departments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { department: "Computer Science", faculty: 8, totalHours: 85, avgHours: 10.6 },
                { department: "Mathematics", faculty: 6, totalHours: 62, avgHours: 10.3 },
                { department: "Physics", faculty: 5, totalHours: 48, avgHours: 9.6 },
                { department: "Biology", faculty: 7, totalHours: 72, avgHours: 10.3 },
                { department: "Chemistry", faculty: 6, totalHours: 58, avgHours: 9.7 },
              ].map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{dept.department}</p>
                    <p className="text-xs text-muted-foreground">{dept.faculty} faculty members</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{dept.totalHours} hrs total</p>
                    <p className="text-xs text-muted-foreground">Avg: {dept.avgHours} hrs</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workload Analysis</CardTitle>
            <CardDescription>
              Faculty workload distribution analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { range: "0-5 hours", count: 2, percentage: 15 },
                { range: "6-10 hours", count: 7, percentage: 54 },
                { range: "11-15 hours", count: 3, percentage: 23 },
                { range: "16+ hours", count: 1, percentage: 8 },
              ].map((range, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{range.range}</span>
                    <span>{range.count} faculty ({range.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${range.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}