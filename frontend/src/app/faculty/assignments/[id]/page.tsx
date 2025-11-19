"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Edit, 
  Eye, 
  BarChart, 
  Calendar, 
  Clock, 
  Download,
  Users,
  Hash
} from "lucide-react";
import { FacultyAssignment } from "@/types/faculty";
import { FacultyCourse } from "@/types/faculty";

// Mock data for the assignment
const mockAssignment: FacultyAssignment = {
  id: "1",
  courseId: "3",
  title: "Data Visualization Project",
  description: "Create interactive visualizations for a real-world dataset using Python libraries. Your project should include at least 3 different types of visualizations and a brief analysis of what insights can be drawn from each visualization.",
  dueDate: "2023-10-15T23:59:59Z",
  maxPoints: 100,
  submissionCount: 25,
  gradedCount: 18,
  status: "published"
};

// Mock data for the course
const mockCourse: FacultyCourse = {
  id: "3",
  code: "CS-301",
  name: "Data Science and Machine Learning",
  semester: "Fall",
  year: 2023,
  credits: 4,
  department: "Computer Science",
  studentCount: 28,
  syllabusStatus: "published"
};

export default function AssignmentDetailsPage() {
  const [assignment] = useState<FacultyAssignment>(mockAssignment);
  const [course] = useState<FacultyCourse>(mockCourse);

  const getDueDateStatus = () => {
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Overdue", variant: "destructive" };
    if (diffDays === 0) return { text: "Due Today", variant: "destructive" };
    if (diffDays <= 3) return { text: "Due Soon", variant: "default" };
    if (diffDays <= 7) return { text: "This Week", variant: "secondary" };
    return { text: `${diffDays} days`, variant: "outline" };
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{assignment.title}</h1>
          <p className="text-muted-foreground">{course.code}: {course.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart size={16} />
            Analytics
          </Button>
          <Button className="gap-2">
            <Edit size={16} />
            Edit Assignment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Assignment Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="default">{assignment.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Due Date</span>
              <div className="flex items-center gap-2">
                <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                <Badge variant={dueDateStatus.variant}>{dueDateStatus.text}</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Due Time</span>
              <span>{new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Maximum Points</span>
              <span className="font-medium">{assignment.maxPoints}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Course</span>
              <span className="font-medium">{course.code}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users size={20} />
              Submission Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Students</span>
              <span className="font-medium">{course.studentCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Submitted</span>
              <span className="font-medium">{assignment.submissionCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Graded</span>
              <span className="font-medium">{assignment.gradedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium">{assignment.submissionCount - assignment.gradedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Not Submitted</span>
              <span className="font-medium">{course.studentCount - assignment.submissionCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart size={20} />
              Grading Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span>{Math.round((assignment.gradedCount / assignment.submissionCount) * 100)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(assignment.gradedCount / assignment.submissionCount) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Score</span>
              <span className="font-medium">84.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Highest Score</span>
              <span className="font-medium">98</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Lowest Score</span>
              <span className="font-medium">62</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Assignment Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{assignment.description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Submission Options</CardTitle>
            <CardDescription>Manage how students submit this assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Late Submissions</h3>
                <p className="text-sm text-muted-foreground">Allowed with 10% penalty</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Multiple Submissions</h3>
                <p className="text-sm text-muted-foreground">Students can resubmit</p>
              </div>
              <Badge variant="outline">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">File Uploads</h3>
                <p className="text-sm text-muted-foreground">PDF, DOC, ZIP files allowed</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common actions for this assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Eye size={16} />
              View Submissions ({assignment.submissionCount})
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <BarChart size={16} />
              Grade Submissions ({assignment.submissionCount - assignment.gradedCount} pending)
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download size={16} />
              Download All Submissions
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText size={16} />
              View Plagiarism Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}