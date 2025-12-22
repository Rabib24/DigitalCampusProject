"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";
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
  const [requirements, setRequirements] = useState<DegreeRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [degreeInfo, setDegreeInfo] = useState<{
    major: string;
    totalCredits: number;
    completedCredits: number;
    remainingCredits: number;
    progressPercentage: number;
    semestersRemaining: number;
  } | null>(null);

  useEffect(() => {
    const fetchDegreePlanning = async () => {
      try {
        setLoading(true);
        const response = await apiGet('/student/degree-planning');
        const data = await response.json();
        
        setDegreeInfo({
          major: data.major,
          totalCredits: data.totalCredits,
          completedCredits: data.completedCredits,
          remainingCredits: data.remainingCredits,
          progressPercentage: data.progressPercentage,
          semestersRemaining: data.semestersRemaining
        });
        
        setRequirements(data.requirements || []);
      } catch (err) {
        setError("Failed to load degree planning data");
        console.error("Degree planning fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDegreePlanning();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-lg">Loading degree planning data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Degree Planning</h2>
        <p className="text-muted-foreground mt-1">
          {degreeInfo ? `${degreeInfo.major} - Track your progress toward graduation` : 'Track your progress toward graduation'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {requirements.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">No degree requirements found</div>
              </CardContent>
            </Card>
          ) : (
            requirements.map((req) => (
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
                        style={{ width: `${req.creditsRequired > 0 ? (req.creditsCompleted / req.creditsRequired) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {req.courses.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No courses in this category yet
                      </div>
                    ) : (
                      req.courses.map((course) => (
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
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
                  <span className="font-medium">
                    {degreeInfo ? `${degreeInfo.completedCredits}/${degreeInfo.totalCredits}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-medium">
                    {degreeInfo ? `${degreeInfo.remainingCredits} credits` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Progress:</span>
                  <span className="font-medium">
                    {degreeInfo ? `${degreeInfo.progressPercentage}%` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Graduation:</span>
                  <span className="font-medium">
                    {degreeInfo ? `${degreeInfo.semestersRemaining} semester${degreeInfo.semestersRemaining !== 1 ? 's' : ''}` : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Degree Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Complete all required courses in each category to graduate. Courses marked as "In Progress" will contribute to your degree upon completion.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}