"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Plus, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useFaculty } from "@/hooks/faculty/FacultyContext";
import { getFacultyAssignments } from "@/lib/faculty/api";
import { FacultyProtectedRoute } from "@/components/faculty/FacultyProtectedRoute";

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  submissions: number;
  pending: number;
  status: "draft" | "published" | "closed";
}

export default function FacultyAssignmentsPage() {
  const router = useRouter();
  const { state, updateAssignments } = useFaculty();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const data = await getFacultyAssignments();
        const assignmentList = data.assignments || [];
        setAssignments(assignmentList);
        updateAssignments(assignmentList);
      } catch (err) {
        setError("Failed to load assignments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [updateAssignments]);

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

  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <FacultyProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">Manage course assignments and view submissions</p>
          </div>
          <Button 
            className="gap-2"
            onClick={() => router.push("/faculty/assignments/create")}
          >
            <Plus size={18} />
            Create Assignment
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredAssignments.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <CardTitle className="mt-4">
                {searchTerm ? "No assignments found" : "No assignments created"}
              </CardTitle>
              <CardDescription className="mt-2">
                {searchTerm 
                  ? "Try adjusting your search terms" 
                  : "Get started by creating your first assignment"}
              </CardDescription>
              <Button 
                className="mt-4 gap-2"
                onClick={() => router.push("/faculty/assignments/create")}
              >
                <Plus size={16} />
                Create Your First Assignment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAssignments.map((assignment) => (
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

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => router.push(`/faculty/assignments/${assignment.id}/grade`)}
                      >
                        <CheckCircle size={16} />
                        Grade Submissions
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => router.push(`/faculty/assignments/${assignment.id}/edit`)}
                      >
                        <FileText size={16} />
                        Edit Assignment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FacultyProtectedRoute>
  );
}