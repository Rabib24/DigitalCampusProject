"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted";
  priority: "high" | "medium" | "low";
}

export function AssignmentsView() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const response = await apiGet('/student/assignments');
        const data = await response.json();
        setAssignments(data);
      } catch (err) {
        setError("Failed to load assignments");
        console.error("Assignments fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading assignments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const priorityClasses = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive";
      case "medium":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-500";
      default:
        return "bg-green-500/20 text-green-700 dark:text-green-500";
    }
  };

  const statusClasses = (status: "pending" | "submitted") => {
    return status === "submitted"
      ? "bg-green-500/20 text-green-700 dark:text-green-500"
      : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-500";
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Assignments</h2>
        <p className="text-muted-foreground mt-1">Track your pending and submitted assignments</p>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="rounded-lg border bg-card hover:shadow-md transition-shadow">
            <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{assignment.course}</p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityClasses(
                    assignment.priority,
                  )}`}
                >
                  {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses(
                    assignment.status,
                  )}`}
                >
                  {assignment.status === "submitted" ? "Submitted" : "Pending"}
                </span>
              </div>
            </div>

            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px]">
                  D
                </span>
                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {assignment.status === "pending" && (
                  <>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      onClick={() => router.push(`/student/submit-assignment-${assignment.id}`)}
                    >
                      <span className="h-5 w-5 rounded-md bg-primary/20 text-[9px] flex items-center justify-center font-semibold">
                        UP
                      </span>
                      Submit Assignment
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md border bg-transparent px-3 py-1.5 text-xs font-medium hover:bg-accent"
                      onClick={() => router.push(`/student/assignment-detail-${assignment.id}`)}
                    >
                      View Details
                    </button>
                  </>
                )}
                {assignment.status === "submitted" && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border bg-transparent px-3 py-1.5 text-xs font-medium hover:bg-accent"
                    onClick={() => router.push(`/student/assignment-detail-${assignment.id}`)}
                  >
                    View Submission
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
