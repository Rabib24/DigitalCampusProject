"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Target, 
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Edit
} from "lucide-react";
import { FacultyAdvisee } from "@/types/faculty";

// Mock data for the advisee
const mockAdvisee: FacultyAdvisee = {
  id: "1",
  studentId: "S123456",
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@university.edu",
  program: "Computer Science",
  year: 3,
  gpa: 3.75,
  lastMeeting: "2023-10-10T14:30:00Z"
};

interface AcademicMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "completed" | "in-progress" | "upcoming" | "overdue";
  completionDate?: string;
}

interface CourseProgress {
  id: string;
  code: string;
  name: string;
  credits: number;
  currentGrade?: string;
  instructor: string;
  semester: string;
}

export default function AdviseeProgressTrackingPage() {
  const [advisee] = useState<FacultyAdvisee>(mockAdvisee);
  const [milestones, setMilestones] = useState<AcademicMilestone[]>([
    {
      id: "1",
      title: "Complete Core Requirements",
      description: "Finish all required core courses with a minimum GPA of 3.0",
      dueDate: "2024-05-15",
      status: "completed",
      completionDate: "2023-12-15"
    },
    {
      id: "2",
      title: "Declare Specialization",
      description: "Choose a specialization track and meet with advisor",
      dueDate: "2024-03-01",
      status: "completed",
      completionDate: "2023-10-15"
    },
    {
      id: "3",
      title: "Internship Application",
      description: "Apply to at least 3 summer internship positions",
      dueDate: "2024-02-15",
      status: "in-progress"
    },
    {
      id: "4",
      title: "Research Project Proposal",
      description: "Submit proposal for senior capstone research project",
      dueDate: "2024-04-01",
      status: "upcoming"
    },
    {
      id: "5",
      title: "Graduate Application",
      description: "Prepare and submit graduate school applications",
      dueDate: "2024-10-01",
      status: "upcoming"
    }
  ]);

  const [courses, setCourses] = useState<CourseProgress[]>([
    {
      id: "1",
      code: "CS-301",
      name: "Data Science and Machine Learning",
      credits: 4,
      currentGrade: "A-",
      instructor: "Dr. Smith",
      semester: "Fall 2023"
    },
    {
      id: "2",
      code: "CS-305",
      name: "Software Engineering",
      credits: 3,
      currentGrade: "B+",
      instructor: "Prof. Johnson",
      semester: "Fall 2023"
    },
    {
      id: "3",
      code: "MATH-205",
      name: "Discrete Mathematics",
      credits: 3,
      currentGrade: "A",
      instructor: "Dr. Williams",
      semester: "Fall 2023"
    }
  ]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "secondary";
      case "upcoming": return "outline";
      case "overdue": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle size={16} className="text-green-500" />;
      case "in-progress": return <Clock size={16} className="text-blue-500" />;
      case "upcoming": return <Clock size={16} className="text-muted-foreground" />;
      case "overdue": return <AlertCircle size={16} className="text-red-500" />;
      default: return <Clock size={16} />;
    }
  };

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-500";
    if (gpa >= 3.0) return "text-blue-500";
    if (gpa >= 2.5) return "text-yellow-500";
    return "text-red-500";
  };

  const completedMilestones = milestones.filter(m => m.status === "completed").length;
  const totalMilestones = milestones.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">{advisee.firstName} {advisee.lastName} - Academic Progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit size={16} />
            Update Progress
          </Button>
          <Button className="gap-2">
            <Plus size={16} />
            Add Milestone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Current GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getGpaColor(advisee.gpa)}`}>
              {advisee.gpa.toFixed(2)}
            </div>
            <div className="text-muted-foreground">Program: {advisee.program}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Current Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">72</div>
            <div className="text-muted-foreground">Required: 120</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedMilestones / totalMilestones) * 100)}%
            </div>
            <div className="text-muted-foreground">
              {completedMilestones} of {totalMilestones} milestones
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={20} />
              Last Meeting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {new Date(advisee.lastMeeting!).toLocaleDateString()}
            </div>
            <div className="text-muted-foreground">
              {Math.floor((new Date().getTime() - new Date(advisee.lastMeeting!).getTime()) / (1000 * 60 * 60 * 24))} days ago
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target size={20} />
              Academic Milestones
            </CardTitle>
            <CardDescription>Track progress toward degree requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(milestone.status)}
                        <h3 className="font-medium">{milestone.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-muted-foreground" />
                          <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        </div>
                        {milestone.completionDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle size={14} className="text-muted-foreground" />
                            <span>Completed: {new Date(milestone.completionDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(milestone.status)}>
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Current Courses
            </CardTitle>
            <CardDescription>Current semester course progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{course.code}</span>
                        <span className="text-muted-foreground">•</span>
                        <span>{course.name}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen size={14} className="text-muted-foreground" />
                          <span>{course.credits} credits</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Instructor:</span>
                          <span>{course.instructor}</span>
                        </div>
                      </div>
                    </div>
                    {course.currentGrade && (
                      <Badge variant="default" className={getGpaColor(course.currentGrade === "A" || course.currentGrade === "A-" ? 4 : 3)}>
                        {course.currentGrade}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress Visualization</CardTitle>
          <CardDescription>Academic progress overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                Detailed progress visualization would appear here
              </p>
              <p className="text-sm text-muted-foreground">
                Showing GPA trends, credit completion, and milestone progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}