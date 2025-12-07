"use client";

import { Course } from "@/lib/student/course-enrollment";
import { BookOpen, Users, CreditCard, Clock, User, Calendar, FileText } from "lucide-react";

interface CourseDetailViewProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (courseId: string) => void;
}

export function CourseDetailView({ course, isOpen, onClose, onAddToCart }: CourseDetailViewProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-2xl rounded-lg border bg-card shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-6 py-4">
          <h3 className="text-xl font-bold">{course.name}</h3>
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
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              {course.code}
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium">
              <Users className="h-4 w-4" />
              {course.department}
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium">
              <CreditCard className="h-4 w-4" />
              {course.credits} Credits
            </div>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-lg font-semibold mb-2">
              <FileText className="h-5 w-5" />
              Course Description
            </h4>
            <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
              {course.description || "No detailed description available for this course."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h4 className="flex items-center gap-2 font-semibold mb-2">
                <Clock className="h-4 w-4" />
                Availability
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Total Seats
                  </span>
                  <span className="font-medium">{course.total_seats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Available Seats
                  </span>
                  <span className="font-medium">{course.available_seats}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Currently Enrolled
                  </span>
                  <span className="font-medium">{course.total_seats - course.available_seats}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${((course.total_seats - course.available_seats) / course.total_seats) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="flex items-center gap-2 font-semibold mb-2">
                <Calendar className="h-4 w-4" />
                Schedule Information
              </h4>
              <div className="text-muted-foreground space-y-2">
                {course.schedule ? (
                  <div className="space-y-2">
                    {typeof course.schedule === 'object' ? (
                      Object.entries(course.schedule).map(([day, schedule]) => (
                        <div key={day} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span className="font-medium capitalize">{day}</span>
                          <span>{String(schedule)}</span>
                        </div>
                      ))
                    ) : (
                      <p>{String(course.schedule)}</p>
                    )}
                  </div>
                ) : (
                  <p>Schedule information not available</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="font-semibold mb-2">Enrollment Status</h4>
            <div className="flex items-center gap-4">
              {course.available_seats > 0 ? (
                <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-500">
                  Open for Enrollment ({course.available_seats} seats available)
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-500">
                  Waitlist Only ({course.total_seats - course.available_seats} students enrolled)
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-accent"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                onAddToCart(course.id);
                onClose();
              }}
              disabled={course.available_seats === 0}
            >
              {course.available_seats > 0 ? "Add to Cart" : "Join Waitlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}