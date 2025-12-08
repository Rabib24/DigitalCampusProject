"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { CourseEnrollmentService, type Enrollment, CourseEnrollmentError } from "@/lib/student/course-enrollment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RegistrationConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  enrollmentResults: {
    successful_enrollments: Array<{ course_id: string; status: string; waitlist_position?: number }>;
    failed_enrollments: Array<{ course_id: string; reason: string }>;
  };
}

const RegistrationConfirmationComponent = memo(({ isOpen, onClose, enrollmentResults }: RegistrationConfirmationProps) => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load student enrollments after successful registration
  useEffect(() => {
    if (isOpen) {
      loadEnrollments();
    }
  }, [isOpen]);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentEnrollments = await CourseEnrollmentService.getStudentEnrollments();
      setEnrollments(studentEnrollments);
    } catch (err) {
      if (err instanceof CourseEnrollmentError) {
        setError(err.message);
      } else {
        setError("Failed to load enrollments");
      }
      console.error("Failed to load enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const successfulCount = enrollmentResults.successful_enrollments.length;
  const failedCount = enrollmentResults.failed_enrollments.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg border bg-card shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-6 py-4">
          <h3 className="text-xl font-bold">Registration Confirmation</h3>
          <button
            type="button"
            className="rounded-md p-1 hover:bg-muted"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
              failedCount === 0 ? "bg-green-500/10" : "bg-yellow-500/10"
            }`}>
              {failedCount === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              )}
            </div>
            <h4 className="text-lg font-semibold">
              {successfulCount} course{successfulCount !== 1 ? "s" : ""} enrolled successfully
            </h4>
            {failedCount > 0 && (
              <p className="text-muted-foreground mt-1">
                {failedCount} course{failedCount !== 1 ? "s" : ""} could not be enrolled
              </p>
            )}
          </div>

          {successfulCount > 0 && (
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-3">Successfully Enrolled</h4>
              <div className="space-y-3">
                {enrollmentResults.successful_enrollments.map((enrollment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-md bg-green-500/5 border border-green-500/20">
                    <div>
                      <p className="font-medium">Course ID: {enrollment.course_id}</p>
                      {enrollment.status === "waitlisted" && (
                        <p className="text-sm text-yellow-500">
                          Waitlisted at position #{enrollment.waitlist_position}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                      {enrollment.status === "enrolled" ? "Enrolled" : "Waitlisted"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {failedCount > 0 && (
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-3 text-red-500">Enrollment Issues</h4>
              <div className="space-y-3">
                {enrollmentResults.failed_enrollments.map((failure, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-md bg-red-500/5 border border-red-500/20">
                    <div>
                      <p className="font-medium">Course ID: {failure.course_id}</p>
                      <p className="text-sm text-muted-foreground">{failure.reason}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                      Failed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border p-4">
            <h4 className="font-semibold mb-3">Your Current Enrollments</h4>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-md bg-muted">
                      <div>
                        <p className="font-medium">{enrollment.course_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.course_code} • {enrollment.credits} Credits
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {enrollment.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No enrollments found</p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-accent"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export { RegistrationConfirmationComponent as RegistrationConfirmation };
