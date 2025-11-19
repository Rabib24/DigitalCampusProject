"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  CreditCard, 
  FileText, 
  Users, 
  Building,
  Edit,
  BarChart,
  Settings,
  Eye
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

export default function CourseDetailsPage() {
  const router = useRouter();
  const [course] = useState<FacultyCourse>(mockCourse);
  
  const getSyllabusStatusVariant = (status: FacultyCourse["syllabusStatus"]) => {
    switch (status) {
      case "draft": return "secondary";
      case "published": return "default";
      case "archived": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-muted-foreground">{course.code} • {course.department}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye size={16} />
            View as Student
          </Button>
          <Button className="gap-2">
            <Edit size={16} />
            Edit Course
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Course Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Credits</span>
              <span className="font-medium">{course.credits}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Semester</span>
              <span className="font-medium">{course.semester} {course.year}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Department</span>
              <span className="font-medium">{course.department}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Students Enrolled</span>
              <span className="font-medium">{course.studentCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Syllabus Status</span>
              <Badge variant={getSyllabusStatusVariant(course.syllabusStatus)}>
                {course.syllabusStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart size={20} />
              Course Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Attendance Rate</span>
              <span className="font-medium">87%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Grade</span>
              <span className="font-medium">B+</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Assignments</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Quizzes</span>
              <span className="font-medium">4</span>
            </div>
            <Button variant="outline" className="w-full">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText size={16} />
              Manage Syllabus
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => router.push(`/faculty/courses/${course.id}/students`)}
            >
              <Users size={16} />
              View Students
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => router.push(`/faculty/courses/${course.id}/schedule`)}
            >
              <Calendar size={16} />
              Schedule Class
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => router.push(`/faculty/gradebook?courseId=${course.id}`)}
            >
              <CreditCard size={16} />
              Gradebook
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in your course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="text-primary" size={16} />
                </div>
                <div>
                  <p className="font-medium">New assignment posted</p>
                  <p className="text-sm text-muted-foreground">&quot;Data Visualization Project&quot; due next week</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="text-primary" size={16} />
                </div>
                <div>
                  <p className="font-medium">New student enrolled</p>
                  <p className="text-sm text-muted-foreground">Alex Johnson joined the course</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CreditCard className="text-primary" size={16} />
                </div>
                <div>
                  <p className="font-medium">Grades submitted</p>
                  <p className="text-sm text-muted-foreground">Quiz 3 grades have been published</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
            <CardDescription>Important dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Midterm Exam</p>
                  <p className="text-sm text-muted-foreground">October 15, 2023</p>
                </div>
                <Badge variant="outline">In 3 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Project Deadline</p>
                  <p className="text-sm text-muted-foreground">October 22, 2023</p>
                </div>
                <Badge variant="outline">In 10 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Guest Lecture</p>
                  <p className="text-sm text-muted-foreground">October 28, 2023</p>
                </div>
                <Badge variant="outline">In 16 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Final Exam</p>
                  <p className="text-sm text-muted-foreground">December 12, 2023</p>
                </div>
                <Badge variant="outline">In 2 months</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}