"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Clock, CheckCircle } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  submissions: number;
  pending: number;
}

export function AssignmentListWidget() {
  // This would normally come from an API call
  const assignments: Assignment[] = [
    { id: 1, title: "Algorithm Design Project", course: "CS-301", dueDate: "2024-12-15", submissions: 28, pending: 5 },
    { id: 2, title: "Capstone Presentation", course: "CS-401", dueDate: "2024-12-20", submissions: 15, pending: 3 },
    { id: 3, title: "Quiz 3", course: "CS-205", dueDate: "2024-12-10", submissions: 45, pending: 12 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Pending Assignments
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus size={16} />
            Create
          </Button>
        </div>
        <CardDescription>Assignments awaiting your attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5">
              <div>
                <div className="font-medium">{assignment.title}</div>
                <div className="text-sm text-muted-foreground">{assignment.course} • Due {assignment.dueDate}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm">
                  <FileText size={16} />
                  {assignment.submissions}
                </div>
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <Clock size={16} />
                  {assignment.pending}
                </div>
              </div>
            </div>
          ))}
          {assignments.length > 0 && (
            <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
              <CheckCircle size={16} />
              Grade All Assignments
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}