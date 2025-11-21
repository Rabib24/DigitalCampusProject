"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  sessions: {
    date: Date;
    status: "present" | "absent" | "late" | "excused";
  }[];
}

interface Session {
  id: string;
  date: Date;
  topic: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
}

export function AttendanceTrackingPage({ courseId }: { courseId: string }) {
  const [sessions] = useState<Session[]>([
    {
      id: "sess_001",
      date: new Date("2025-11-01"),
      topic: "Introduction to Data Structures",
      totalStudents: 30,
      present: 28,
      absent: 2,
      late: 0
    },
    {
      id: "sess_002",
      date: new Date("2025-11-03"),
      topic: "Arrays and Linked Lists",
      totalStudents: 30,
      present: 25,
      absent: 3,
      late: 2
    },
    {
      id: "sess_003",
      date: new Date("2025-11-08"),
      topic: "Stacks and Queues",
      totalStudents: 30,
      present: 27,
      absent: 2,
      late: 1
    },
    {
      id: "sess_004",
      date: new Date("2025-11-10"),
      topic: "Trees and Graphs",
      totalStudents: 30,
      present: 26,
      absent: 3,
      late: 1
    }
  ]);

  const [attendance, setAttendance] = useState<StudentAttendance[]>([
    {
      id: "att_001",
      studentId: "stud_001",
      studentName: "Alex Johnson",
      studentEmail: "a.johnson@university.edu",
      sessions: [
        { date: new Date("2025-11-01"), status: "present" },
        { date: new Date("2025-11-03"), status: "present" },
        { date: new Date("2025-11-08"), status: "late" },
        { date: new Date("2025-11-10"), status: "present" }
      ]
    },
    {
      id: "att_002",
      studentId: "stud_002",
      studentName: "Sam Wilson",
      studentEmail: "s.wilson@university.edu",
      sessions: [
        { date: new Date("2025-11-01"), status: "present" },
        { date: new Date("2025-11-03"), status: "absent" },
        { date: new Date("2025-11-08"), status: "present" },
        { date: new Date("2025-11-10"), status: "present" }
      ]
    },
    {
      id: "att_003",
      studentId: "stud_003",
      studentName: "Taylor Smith",
      studentEmail: "t.smith@university.edu",
      sessions: [
        { date: new Date("2025-11-01"), status: "present" },
        { date: new Date("2025-11-03"), status: "present" },
        { date: new Date("2025-11-08"), status: "present" },
        { date: new Date("2025-11-10"), status: "absent" }
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "late":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const calculateAttendancePercentage = (student: StudentAttendance) => {
    const totalSessions = student.sessions.length;
    const presentSessions = student.sessions.filter(s => s.status === "present").length;
    return totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0;
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-muted-foreground mt-1">CS-203 Data Structures and Algorithms</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Across all sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Students</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Currently</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
          <CardDescription>
            Attendance statistics for each class session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <div className="font-medium">{session.topic}</div>
                  <div className="text-sm text-muted-foreground">
                    {session.date.toLocaleDateString()} • {session.present}/{session.totalStudents} present
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">{session.present}</div>
                    <div className="text-xs text-muted-foreground">Present</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">{session.absent}</div>
                    <div className="text-xs text-muted-foreground">Absent</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-yellow-600">{session.late}</div>
                    <div className="text-xs text-muted-foreground">Late</div>
                  </div>
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(session.present / session.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Attendance</CardTitle>
          <CardDescription>
            Detailed attendance records for each student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Student</th>
                  <th className="text-left py-3 px-2">Email</th>
                  {sessions.map((session, index) => (
                    <th key={index} className="text-center py-3 px-2">
                      {session.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </th>
                  ))}
                  <th className="text-center py-3 px-2">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2">
                      <div className="font-medium">{student.studentName}</div>
                      <div className="text-sm text-muted-foreground">ID: {student.studentId}</div>
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">{student.studentEmail}</td>
                    {student.sessions.map((session, index) => (
                      <td key={index} className="py-3 px-2 text-center">
                        {getStatusIcon(session.status)}
                      </td>
                    ))}
                    <td className="py-3 px-2 text-center">
                      <div className="font-medium">{calculateAttendancePercentage(student)}%</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}