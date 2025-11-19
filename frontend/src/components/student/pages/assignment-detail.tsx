"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle } from "lucide-react";

interface AssignmentDetailPageProps {
  assignmentId: string;
}

export function AssignmentDetailPage({ assignmentId }: AssignmentDetailPageProps) {
  const router = useRouter();

  const assignment = {
    id: assignmentId,
    title: "Algorithm Implementation Project",
    course: "CS-203: Data Structures and Algorithms",
    dueDate: "2024-10-15",
    points: 100,
    type: "Project",
    description: "Implement sorting algorithms and analyze their time complexity.",
    status: "submitted",
    submittedDate: "2024-10-14",
    grade: 92,
    feedback: "Excellent implementation with good optimization!",
  };

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Badge className="mb-4">{assignment.type}</Badge>
        <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
        <p className="text-muted-foreground">{assignment.course}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Due Date</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
            {isOverdue && (
              <span className="ml-2 text-xs text-destructive">Overdue</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-bold text-lg">{assignment.points} pts</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{assignment.description}</p>
          <div className="bg-accent/5 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Requirements:</p>
            <ul className="text-sm space-y-2 list-disc list-inside">
              <li>Implement at least 3 sorting algorithms</li>
              <li>Provide time and space complexity analysis</li>
              <li>Include test cases and results</li>
              <li>Write clear, documented code</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {assignment.status === "submitted" && (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <CardTitle>Submission Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Submitted on</p>
              <p className="font-medium">
                {new Date(assignment.submittedDate).toLocaleDateString()}
              </p>
            </div>
            {assignment.grade && (
              <div>
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="font-bold text-2xl text-green-600">{assignment.grade}/100</p>
              </div>
            )}
            {assignment.feedback && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Instructor Feedback</p>
                <p className="p-3 bg-white/5 rounded-lg border border-border">
                  {assignment.feedback}
                </p>
              </div>
            )}
            <Button variant="outline" className="w-full bg-transparent">
              View Detailed Feedback
            </Button>
          </CardContent>
        </Card>
      )}

      {assignment.status !== "submitted" && (
        <Card>
          <CardHeader>
            <CardTitle>Ready to Submit?</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => router.push(`/student/submit-assignment-${assignmentId}`)}
            >
              Submit Assignment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
