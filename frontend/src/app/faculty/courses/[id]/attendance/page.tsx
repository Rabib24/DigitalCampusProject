"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart, 
  Search, 
  Filter, 
  Download,
  Upload,
  Plus
} from "lucide-react";
import { FacultyCourse } from "@/types/faculty";

// Mock data for the course
const mockCourse: FacultyCourse = {
  id: "1",
  code: "CS-301",
  name: "Data Science and Machine Learning",
  semester: "Fall",
  year: 2023,
  credits: 4,
  department: "Computer Science",
  studentCount: 28,
  syllabusStatus: "published"
};

interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

interface StudentAttendance {
  student: Student;
  records: AttendanceRecord[];
}

export default function AttendanceTrackingPage() {
  const [course] = useState<FacultyCourse>(mockCourse);
  const [students] = useState<Student[]>([
    { id: "1", name: "Alex Johnson", studentId: "S123456", email: "alex.johnson@university.edu" },
    { id: "2", name: "Sarah Williams", studentId: "S123457", email: "sarah.williams@university.edu" },
    { id: "3", name: "Michael Chen", studentId: "S123458", email: "michael.chen@university.edu" },
    { id: "4", name: "Emma Davis", studentId: "S123459", email: "emma.davis@university.edu" },
    { id: "5", name: "James Wilson", studentId: "S123460", email: "james.wilson@university.edu" },
    { id: "6", name: "Olivia Brown", studentId: "S123461", email: "olivia.brown@university.edu" },
    { id: "7", name: "Daniel Taylor", studentId: "S123462", email: "daniel.taylor@university.edu" },
    { id: "8", name: "Sophia Martinez", studentId: "S123463", email: "sophia.martinez@university.edu" }
  ]);

  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>([
    {
      student: { id: "1", name: "Alex Johnson", studentId: "S123456", email: "alex.johnson@university.edu" },
      records: [
        { id: "1-1", date: "2023-09-15", status: "present" },
        { id: "1-2", date: "2023-09-18", status: "late", notes: "Arrived 10 minutes late" },
        { id: "1-3", date: "2023-09-20", status: "present" },
        { id: "1-4", date: "2023-09-22", status: "absent" }
      ]
    },
    {
      student: { id: "2", name: "Sarah Williams", studentId: "S123457", email: "sarah.williams@university.edu" },
      records: [
        { id: "2-1", date: "2023-09-15", status: "present" },
        { id: "2-2", date: "2023-09-18", status: "present" },
        { id: "2-3", date: "2023-09-20", status: "present" },
        { id: "2-4", date: "2023-09-22", status: "present" }
      ]
    }
    // Add more student data as needed
  ]);

  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const classDates = ["2023-09-15", "2023-09-18", "2023-09-20", "2023-09-22", "2023-09-25"];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "present": return "default";
      case "absent": return "destructive";
      case "late": return "secondary";
      case "excused": return "outline";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <CheckCircle size={16} className="text-green-500" />;
      case "absent": return <XCircle size={16} className="text-red-500" />;
      case "late": return <Clock size={16} className="text-yellow-500" />;
      case "excused": return <CheckCircle size={16} className="text-blue-500" />;
      default: return <CheckCircle size={16} />;
    }
  };

  const updateAttendance = (studentId: string, date: string, status: "present" | "absent" | "late" | "excused") => {
    setAttendanceData(attendanceData.map(studentAttendance => {
      if (studentAttendance.student.id === studentId) {
        const existingRecordIndex = studentAttendance.records.findIndex(record => record.date === date);
        
        if (existingRecordIndex >= 0) {
          // Update existing record
          const updatedRecords = [...studentAttendance.records];
          updatedRecords[existingRecordIndex] = { ...updatedRecords[existingRecordIndex], status };
          return { ...studentAttendance, records: updatedRecords };
        } else {
          // Add new record
          return {
            ...studentAttendance,
            records: [
              ...studentAttendance.records,
              { id: `${studentId}-${date}`, date, status }
            ]
          };
        }
      }
      return studentAttendance;
    }));
  };

  const getStudentAttendance = (studentId: string, date: string) => {
    const studentData = attendanceData.find(sa => sa.student.id === studentId);
    if (studentData) {
      const record = studentData.records.find(r => r.date === date);
      return record ? record.status : null;
    }
    return null;
  };

  const calculateAttendanceRate = (studentId: string) => {
    const studentData = attendanceData.find(sa => sa.student.id === studentId);
    if (studentData && studentData.records.length > 0) {
      const presentCount = studentData.records.filter(r => r.status === "present" || r.status === "late").length;
      return Math.round((presentCount / studentData.records.length) * 100);
    }
    return 0;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "good" && calculateAttendanceRate(student.id) >= 80) ||
                         (filterStatus === "poor" && calculateAttendanceRate(student.id) < 80);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance Tracking</h1>
          <p className="text-muted-foreground">{course.code}: {course.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload size={16} />
            Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart size={20} />
              Attendance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Students</span>
                <span className="font-medium">{students.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Attendance</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Classes Held</span>
                <span className="font-medium">{classDates.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Perfect Attendance</span>
                <span className="font-medium">5 students</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{new Date(currentDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Students Present</span>
                <span className="font-medium">24/{students.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Late Arrivals</span>
                <span className="font-medium">3</span>
              </div>
              <Button className="w-full gap-2">
                <Plus size={16} />
                Take Attendance
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Monday, Sep 25</span>
                <Badge variant="outline">In 3 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Wednesday, Sep 27</span>
                <Badge variant="outline">In 5 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Friday, Sep 29</span>
                <Badge variant="outline">In 7 days</Badge>
              </div>
              <Button variant="outline" className="w-full">
                Schedule Class
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Students</option>
                <option value="good">Good Attendance (80%+)</option>
                <option value="poor">Poor Attendance (&lt;80%)</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Student</th>
                  <th className="text-left p-4">Student ID</th>
                  {classDates.map(date => (
                    <th key={date} className="text-center p-4">
                      {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </th>
                  ))}
                  <th className="text-center p-4">Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </td>
                    <td className="p-4">{student.studentId}</td>
                    {classDates.map(date => {
                      const status = getStudentAttendance(student.id, date);
                      return (
                        <td key={`${student.id}-${date}`} className="p-4 text-center">
                          {status ? (
                            <div className="flex justify-center">
                              {getStatusIcon(status)}
                            </div>
                          ) : (
                            <div className="flex justify-center gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => updateAttendance(student.id, date, "present")}
                              >
                                <CheckCircle size={16} className="text-green-500" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => updateAttendance(student.id, date, "late")}
                              >
                                <Clock size={16} className="text-yellow-500" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => updateAttendance(student.id, date, "absent")}
                              >
                                <XCircle size={16} className="text-red-500" />
                              </Button>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <Badge variant={calculateAttendanceRate(student.id) >= 80 ? "default" : "destructive"}>
                        {calculateAttendanceRate(student.id)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-medium">No students found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "All students have been filtered out"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}