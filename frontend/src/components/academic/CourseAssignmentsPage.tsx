"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  Edit, 
  Eye, 
  FileText, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  type: string;
  status: "draft" | "published" | "closed";
  submissions: number;
  totalStudents: number;
}

export function CourseAssignmentsPage({ courseId }: { courseId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "assign_001",
      title: "Linked List Implementation",
      description: "Implement a doubly linked list with all basic operations",
      dueDate: new Date("2025-11-20"),
      points: 100,
      type: "Programming Assignment",
      status: "published",
      submissions: 25,
      totalStudents: 30
    },
    {
      id: "assign_002",
      title: "Sorting Algorithms Analysis",
      description: "Compare the performance of different sorting algorithms",
      dueDate: new Date("2025-12-05"),
      points: 150,
      type: "Project",
      status: "published",
      submissions: 12,
      totalStudents: 30
    },
    {
      id: "assign_003",
      title: "Midterm Exam",
      description: "Comprehensive exam covering weeks 1-4",
      dueDate: new Date("2025-11-15"),
      points: 200,
      type: "Exam",
      status: "closed",
      submissions: 30,
      totalStudents: 30
    },
    {
      id: "assign_004",
      title: "Graph Traversal Algorithms",
      description: "Implement BFS and DFS for graph traversal",
      dueDate: new Date("2025-12-20"),
      points: 120,
      type: "Programming Assignment",
      status: "draft",
      submissions: 0,
      totalStudents: 30
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Exam":
        return <FileText className="h-4 w-4" />;
      case "Project":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Assignments</h1>
          <p className="text-muted-foreground mt-1">CS-203 Data Structures and Algorithms</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(assignment.type)}
                    {assignment.title}
                  </CardTitle>
                  <CardDescription>
                    {assignment.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(assignment.status)}
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Due Date</div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.dueDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Points</div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.points}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Type</div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.type}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Submissions</div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.submissions}/{assignment.totalStudents}
                    </div>
                  </div>
                </div>
              </div>
              
              {assignment.status === "published" && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">{assignment.submissions}</span> of{" "}
                      <span className="font-medium">{assignment.totalStudents}</span> students submitted
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Grade Submissions
                      </Button>
                      <Button variant="outline" size="sm">
                        Download All
                      </Button>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Total Assignments</div>
            </div>
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-green-600">2</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-yellow-600">1</div>
              <div className="text-sm text-muted-foreground">Draft</div>
            </div>
            <div className="p-4 rounded-lg border text-center">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-muted-foreground">Closed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}