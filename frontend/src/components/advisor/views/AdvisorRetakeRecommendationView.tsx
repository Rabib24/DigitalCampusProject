"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  Search, 
  Filter, 
  Download,
  Eye,
  TrendingUp
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorRetakeRecommendationView() {
  const recommendationStats = [
    {
      title: "Total Recommendations",
      value: "124",
      change: "+18 from last month",
      icon: RotateCcw
    },
    {
      title: "Students Recommended",
      value: "89",
      change: "+12 from last week",
      icon: TrendingUp
    },
    {
      title: "Courses Recommended",
      value: "156",
      change: "+24 from last month",
      icon: RotateCcw
    },
    {
      title: "Success Rate",
      value: "72%",
      change: "+5% from last term",
      icon: TrendingUp
    }
  ];

  const recommendationData = [
    { course: "Calculus I", recommendations: 24, successRate: 78, color: "#3b82f6" },
    { course: "Physics I", recommendations: 18, successRate: 72, color: "#10b981" },
    { course: "Chemistry I", recommendations: 15, successRate: 68, color: "#f59e0b" },
    { course: "Biology I", recommendations: 12, successRate: 75, color: "#ef4444" },
    { course: "Computer Science I", recommendations: 22, successRate: 82, color: "#8b5cf6" }
  ];

  const studentRecommendations = [
    { 
      id: "REC-001", 
      student: "John Doe", 
      course: "Calculus I", 
      reason: "Failed with grade D",
      recommendedBy: "Dr. Smith",
      date: "2023-06-15",
      status: "Accepted"
    },
    { 
      id: "REC-002", 
      student: "Jane Smith", 
      course: "Physics I", 
      reason: "Grade C-; needs improvement",
      recommendedBy: "Dr. Johnson",
      date: "2023-06-14",
      status: "Pending"
    },
    { 
      id: "REC-003", 
      student: "Robert Johnson", 
      course: "Chemistry I", 
      reason: "Failed with grade F",
      recommendedBy: "Dr. Davis",
      date: "2023-06-12",
      status: "Completed"
    },
    { 
      id: "REC-004", 
      student: "Emily Davis", 
      course: "Biology I", 
      reason: "Grade C; potential for A",
      recommendedBy: "Dr. Wilson",
      date: "2023-06-10",
      status: "Accepted"
    },
    { 
      id: "REC-005", 
      student: "Michael Wilson", 
      course: "Computer Science I", 
      reason: "Grade B; aiming for A",
      recommendedBy: "Dr. Brown",
      date: "2023-06-08",
      status: "Rejected"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Retake Recommendation System</h1>
        <p className="text-muted-foreground">
          Recommend courses for retake based on academic performance and student goals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {recommendationStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Recommendations</CardTitle>
            <CardDescription>
              Number of recommendations and success rates by course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendationData.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{course.course}</span>
                    <span>{course.recommendations} recommendations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${(course.recommendations / 30) * 100}%`, 
                          backgroundColor: course.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{course.successRate}% success</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common retake recommendation tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <RotateCcw className="mr-2 h-4 w-4" />
                Generate Recommendations
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Recommendations
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Course
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Recommendations</CardTitle>
          <CardDescription>
            List of course retake recommendations for students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{recommendation.student}</p>
                  <p className="text-xs text-muted-foreground">{recommendation.id} • {recommendation.course}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Reason: {recommendation.reason}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Recommended By</p>
                    <p className="text-sm font-medium">{recommendation.recommendedBy}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{recommendation.date}</p>
                  </div>
                  <Badge 
                    variant={
                      recommendation.status === "Accepted" 
                        ? "default" 
                        : recommendation.status === "Pending" 
                        ? "secondary" 
                        : recommendation.status === "Completed" 
                        ? "outline" 
                        : "destructive"
                    }
                  >
                    {recommendation.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}