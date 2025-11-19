"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFacultyAssignments } from "@/lib/faculty/api";

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  submissions: number;
  pending: number;
  status: "draft" | "published" | "closed";
}

export function FacultyAssignmentsView() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await getFacultyAssignments();
        setAssignments(data.assignments || []);
      } catch (err) {
        setError("Failed to load assignments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const getStatusBadgeVariant = (status: Assignment["status"]) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: Assignment["status"]) => {
    switch (status) {
      case "published":
        return <CheckCircle size={16} />;
      case "draft":
        return <Clock size={16} />;
      case "closed":
        return <AlertCircle size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Assignments</h2>
          <p className="text-muted-foreground mt-1">Manage course assignments and view submissions</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Create Assignment
        </Button>
      </div>

      {assignments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">No assignments found</CardTitle>
            <CardDescription className="mt-2">
              You haven&apos;t created any assignments yet. Get started by creating your first assignment.
            </CardDescription>
            <Button className="mt-4 gap-2 bg-primary hover:bg-primary/90">
              <Plus size={16} />
              Create Your First Assignment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText size={20} className="text-primary" />
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-1">
                      {assignment.course} • Due {assignment.dueDate}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(assignment.status)} className="flex items-center gap-1">
                    {getStatusIcon(assignment.status)}
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-muted-foreground" />
                      <span>{assignment.submissions} Submissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span>{assignment.pending} Pending</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => router.push(`/faculty/gradebook?assignmentId=${assignment.id}`)}
                    >
                      <CheckCircle size={16} />
                      Grade Submissions
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => router.push(`/faculty/assignments/edit/${assignment.id}`)}
                    >
                      <FileText size={16} />
                      Edit Assignment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => router.push(`/faculty/assignments/submissions/${assignment.id}`)}
                    >
                      <FileText size={16} />
                      View Submissions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}