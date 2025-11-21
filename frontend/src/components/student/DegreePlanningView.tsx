"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Circle, 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp,
  Target
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type DegreeRequirement = {
  id: string;
  name: string;
  creditsRequired: number;
  creditsCompleted: number;
  courses: CourseRequirement[];
};

type CourseRequirement = {
  id: string;
  code: string;
  name: string;
  credits: number;
  status: "completed" | "in-progress" | "planned" | "available";
  semester?: string;
};

export function DegreePlanningView() {
  const [requirements, setRequirements] = useState<DegreeRequirement[]>([
    {
      id: "1",
      name: "Core Computer Science",
      creditsRequired: 45,
      creditsCompleted: 30,
      courses: [
        { id: "1", code: "CS-101", name: "Intro to Programming", credits: 3, status: "completed" },
        { id: "2", code: "CS-102", name: "Data Structures", credits: 3, status: "completed" },
        { id: "3", code: "CS-201", name: "Algorithms", credits: 3, status: "completed" },
        { id: "4", code: "CS-203", name: "Database Systems", credits: 3, status: "in-progress" },
        { id: "5", code: "CS-301", name: "Operating Systems", credits: 3, status: "planned", semester: "Fall 2025" },
        { id: "6", code: "CS-302", name: "Software Engineering", credits: 3, status: "available" },
        { id: "7", code: "CS-401", name: "Senior Project", credits: 3, status: "available" },
      ]
    },
    {
      id: "2",
      name: "Mathematics",
      creditsRequired: 18,
      creditsCompleted: 12,
      courses: [
        { id: "8", code: "MA-101", name: "Calculus I", credits: 3, status: "completed" },
        { id: "9", code: "MA-102", name: "Calculus II", credits: 3, status: "completed" },
        { id: "10", code: "MA-201", name: "Linear Algebra", credits: 3, status: "completed" },
        { id: "11", code: "MA-301", name: "Statistics", credits: 3, status: "in-progress" },
        { id: "12", code: "MA-401", name: "Discrete Math", credits: 3, status: "available" },
      ]
    },
    {
      id: "3",
      name: "General Education",
      creditsRequired: 30,
      creditsCompleted: 21,
      courses: [
        { id: "13", code: "EN-101", name: "English Composition", credits: 3, status: "completed" },
        { id: "14", code: "EN-102", name: "Literature", credits: 3, status: "completed" },
        { id: "15", code: "HI-101", name: "World History", credits: 3, status: "completed" },
        { id: "16", code: "SC-101", name: "Biology", credits: 3, status: "completed" },
        { id: "17", code: "SC-102", name: "Chemistry", credits: 3, status: "completed" },
        { id: "18", code: "AR-101", name: "Art Appreciation", credits: 3, status: "completed" },
        { id: "19", code: "PH-101", name: "Philosophy", credits: 3, status: "in-progress" },
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Circle className="h-4 w-4 text-yellow-500" />;
      case "planned":
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case "planned":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Planned</Badge>;
      default:
        return <Badge variant="secondary">Available</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Degree Planning</h2>
        <p className="text-muted-foreground mt-1">Track your progress toward graduation</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {requirements.map((req) => (
            <Card key={req.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{req.name}</span>
                  <span className="text-sm font-normal">
                    {req.creditsCompleted}/{req.creditsRequired} credits
                  </span>
                </CardTitle>
                <CardDescription>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(req.creditsCompleted / req.creditsRequired) * 100}%` }}
                    ></div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {req.courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(course.status)}
                        <div>
                          <div className="font-medium">{course.code} - {course.name}</div>
                          <div className="text-sm text-muted-foreground">{course.credits} credits</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {course.semester && (
                          <span className="text-sm text-muted-foreground">{course.semester}</span>
                        )}
                        {getStatusBadge(course.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Credits:</span>
                  <span className="font-medium">63/93</span>
                </div>
                <div className="flex justify-between">
                  <span>GPA:</span>
                  <span className="font-medium">3.45</span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Graduation:</span>
                  <span className="font-medium">Dec 2025</span>
                </div>
              </div>
              <Button className="w-full">
                <Edit className="h-4 w-4 mr-2" />
                Update Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border">
                <div className="font-medium">Consider taking MA-401 next semester</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Required for your concentration in Data Science
                </div>
              </div>
              <div className="p-3 rounded-lg border">
                <div className="font-medium">CS-302 opens in Spring 2026</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Prerequisites will be met by then
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}