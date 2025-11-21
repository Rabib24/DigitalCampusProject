"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  FileText, 
  MessageCircle, 
  BarChart3, 
  Plus,
  Edit,
  Download,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/models/Course";

export function CourseDetailsPage({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would fetch course data from the backend
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setCourse({
            id: courseId,
            code: "CS-203",
            name: "Data Structures and Algorithms",
            description: "This course covers fundamental data structures and algorithms including arrays, linked lists, trees, graphs, sorting, and searching algorithms.",
            credits: 3,
            instructorId: "inst_12345",
            schedule: "Mon/Wed/Fri 10:00-11:00 AM",
            students: ["student_001", "student_002", "student_003"],
            assignments: ["assign_001", "assign_002"],
            createdAt: new Date(),
            department: "Computer Science",
            prerequisites: ["CS-101", "MA-101"],
            syllabus: "Week 1: Introduction to Data Structures\nWeek 2: Arrays and Linked Lists\nWeek 3: Stacks and Queues\nWeek 4: Trees\nWeek 5: Graphs\nWeek 6: Sorting Algorithms\nWeek 7: Searching Algorithms\nWeek 8: Hash Tables",
            textbooks: ["Introduction to Algorithms by Cormen", "Data Structures and Algorithms in Java by Goodrich"],
            enrollmentLimit: 30,
            waitlist: [],
            startDate: new Date("2025-09-01"),
            endDate: new Date("2025-12-15"),
            gradingScale: { "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0 },
            categories: ["Core", "Programming"],
            materials: ["lecture_001", "lecture_002"],
            announcements: ["ann_001", "ann_002"]
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Failed to load course details");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading course details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Course not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{course.name}</h1>
          <p className="text-muted-foreground mt-1">{course.code} • {course.credits} credits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-muted-foreground mt-1">{course.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Department</h3>
                    <p className="text-muted-foreground">{course.department}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Instructor</h3>
                    <p className="text-muted-foreground">Dr. Ahmed Khan (ID: {course.instructorId})</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Prerequisites</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {course.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="secondary">{prereq}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold">Textbooks</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-1">
                    {course.textbooks.map((textbook, index) => (
                      <li key={index}>{textbook}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule & Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Schedule</h3>
                  <p className="text-muted-foreground">{course.schedule}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Duration</h3>
                  <p className="text-muted-foreground">
                    {course.startDate.toLocaleDateString()} - {course.endDate.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Enrollment</h3>
                  <p className="text-muted-foreground">
                    {course.students.length} students enrolled (limit: {course.enrollmentLimit})
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Waitlist</h3>
                  <p className="text-muted-foreground">
                    {course.waitlist.length} students on waitlist
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Course Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">Syllabus</div>
                    <div className="text-sm text-muted-foreground">PDF Document</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">Lecture Notes - Week 1</div>
                    <div className="text-sm text-muted-foreground">PDF Document</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">Lecture Recording - Week 1</div>
                    <div className="text-sm text-muted-foreground">Video File</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Course Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Students Enrolled</span>
                  <span className="font-medium">{course.students.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assignments</span>
                  <span className="font-medium">{course.assignments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Materials</span>
                  <span className="font-medium">{course.materials.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Announcements</span>
                  <span className="font-medium">{course.announcements.length}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border">
                  <div className="font-medium">Assignment 2 Deadline Extended</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    The deadline for Assignment 2 has been extended to November 25th.
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Posted 2 days ago</div>
                </div>
                
                <div className="p-3 rounded-lg border">
                  <div className="font-medium">Midterm Exam Schedule</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    The midterm exam will be held on November 15th during class time.
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Posted 1 week ago</div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Announcements
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Assignments</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Grades</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">Students</span>
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Attendance</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}