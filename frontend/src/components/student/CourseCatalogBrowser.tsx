"use client";

import { useState, useMemo } from "react";
import { CourseEnrollmentService, type Course } from "@/lib/student/course-enrollment";
import { CourseCard } from "./CourseCard";

interface CourseCatalogBrowserProps {
  courses: Course[];
  loading: boolean;
  onAddToCart: (courseId: string) => Promise<void>;
}

export function CourseCatalogBrowser({ courses, loading, onAddToCart }: CourseCatalogBrowserProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  // Memoize filtered and sorted courses for performance
  const optimizedCourses = useMemo(() => {
    // For very large lists, we might implement pagination or virtualization
    // For now, we'll just return the courses as-is but memoized
    return courses;
  }, [courses]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDetailViewOpen(true);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
            <div className="flex justify-between">
              <div className="h-8 bg-muted rounded w-24"></div>
              <div className="h-8 bg-muted rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (optimizedCourses.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No courses found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {optimizedCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onAddToCart={onAddToCart}
            onViewDetails={handleCourseClick}
          />
        ))}
      </div>

      {/* CourseDetailView will be implemented separately */}
    </>
  );
}