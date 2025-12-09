"use client";

import { memo } from "react";
import { type Course } from "@/lib/student/course-enrollment";
import { BookOpen, Users, Clock, CreditCard, Check, X, Calendar, MapPin } from "lucide-react";

interface CourseCardProps {
  course: Course;
  onAddToCart: (courseId: string) => Promise<void>;
  onViewDetails: (course: Course) => void;
}

function CourseCardComponent({ course, onAddToCart, onViewDetails }: CourseCardProps) {
  const handleAddToCart = async (courseId: string) => {
    try {
      await onAddToCart(courseId);
    } catch (error) {
      console.error("Failed to add course to cart:", error);
    }
  };

  return (
    <div className="rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold">{course.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-mono bg-muted px-2 py-0.5 rounded">{course.code}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {course.department}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
              <CreditCard className="h-3 w-3 mr-1" />
              {course.credits} Credits
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">
              <Users className="h-3 w-3 mr-1" />
              {course.total_seats - course.available_seats}/{course.total_seats} Enrolled
            </span>
          </div>
        </div>
      </div>

      {course.schedule && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="font-semibold">{course.schedule.days}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{course.schedule.time}</span>
            </span>
            <span className="flex items-center gap-1">
              {/* MapPin is used for Room */}
              <MapPin className="h-3 w-3" />
              <span className="font-medium">Room: {course.schedule.room}</span>
            </span>
          </div>
        </div>
      )}

      <div className="px-4 pb-4 space-y-3">
        <div className="text-sm text-muted-foreground line-clamp-2">
          {course.description || "No description available for this course."}
        </div>

        {/* Prerequisites indicator for recommended courses */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Prerequisites:</span>
            {course.prereqs_met ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <Check className="h-3 w-3" />
                Met
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-red-600">
                <X className="h-3 w-3" />
                Not Met
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Available Seats:</span>
            <span className="font-medium">
              {course.available_seats}
            </span>
          </div>
          {course.available_seats === 0 && (
            <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-500">
              Waitlist Only
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm font-medium hover:bg-accent"
            onClick={() => onViewDetails(course)}
          >
            View Details
          </button>
          <button
            type="button"
            className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            onClick={() => handleAddToCart(course.id)}
            disabled={course.available_seats === 0}
          >
            {course.available_seats > 0 ? "Add to Cart" : "Join Waitlist"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const CourseCard = memo(CourseCardComponent);