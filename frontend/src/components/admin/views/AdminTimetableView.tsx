"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Calendar } from "lucide-react";

export function AdminTimetableView() {
  const timetableData = [
    {
      id: 1,
      course: "CS101 - Introduction to Computer Science",
      instructor: "Dr. Jane Smith",
      day: "Monday",
      time: "09:00 - 10:30",
      room: "Room 201",
      department: "Computer Science",
      status: "active",
    },
    {
      id: 2,
      course: "MATH201 - Calculus II",
      instructor: "Dr. Robert Johnson",
      day: "Tuesday",
      time: "11:00 - 12:30",
      room: "Room 105",
      department: "Mathematics",
      status: "active",
    },
    {
      id: 3,
      course: "PHYS301 - Quantum Mechanics",
      instructor: "Dr. Emily Davis",
      day: "Wednesday",
      time: "14:00 - 15:30",
      room: "Room 302",
      department: "Physics",
      status: "active",
    },
    {
      id: 4,
      course: "BIO101 - Introduction to Biology",
      instructor: "Dr. Michael Wilson",
      day: "Thursday",
      time: "10:00 - 11:30",
      room: "Room 108",
      department: "Biology",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Timetable Management</h1>
        <p className="text-muted-foreground">
          Manage class schedules, room allocations, and instructor timetables.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>
                View and manage all class timetables.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search timetable..."
                  className="pl-8 md:w-[200px] lg:w-[300px]"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetableData.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">{classItem.course}</TableCell>
                  <TableCell>{classItem.instructor}</TableCell>
                  <TableCell>{classItem.day}</TableCell>
                  <TableCell>{classItem.time}</TableCell>
                  <TableCell>{classItem.room}</TableCell>
                  <TableCell>{classItem.department}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        classItem.status === "active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {classItem.status}
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
            <CardTitle>Room Utilization</CardTitle>
            <CardDescription>
              Room usage statistics and availability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { room: "Room 101", utilization: 85, status: "High" },
                { room: "Room 105", utilization: 72, status: "Medium" },
                { room: "Room 201", utilization: 92, status: "High" },
                { room: "Room 302", utilization: 65, status: "Medium" },
                { room: "Room 108", utilization: 45, status: "Low" },
              ].map((room, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{room.room}</p>
                    <p className="text-xs text-muted-foreground">{room.utilization}% utilization</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={room.status === "High" ? "destructive" : room.status === "Medium" ? "default" : "secondary"}>
                      {room.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructor Workload</CardTitle>
            <CardDescription>
              Teaching hours per instructor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { instructor: "Dr. Jane Smith", hours: 12, courses: 3 },
                { instructor: "Dr. Robert Johnson", hours: 9, courses: 2 },
                { instructor: "Dr. Emily Davis", hours: 6, courses: 1 },
                { instructor: "Dr. Michael Wilson", hours: 15, courses: 4 },
              ].map((instructor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{instructor.instructor}</p>
                    <p className="text-xs text-muted-foreground">{instructor.courses} courses</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{instructor.hours} hours</p>
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