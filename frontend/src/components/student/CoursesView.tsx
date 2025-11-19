"use client";

import { useRouter } from "next/navigation";
import { mockCourses } from "@/components/student/mockData";

export function CoursesView() {
  const router = useRouter();
  const courses = mockCourses;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Courses</h2>
        <p className="text-muted-foreground mt-1">You are enrolled in 5 courses this semester</p>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="rounded-lg border bg-card hover:shadow-md transition-shadow">
            <div className="px-4 pt-4 pb-2 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-primary/10 text-[10px] font-semibold flex items-center justify-center text-primary">
                    {course.code.split("-")[0]}
                  </div>
                  <h3 className="text-lg font-semibold">{course.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {course.code} • {course.credits} Credits
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {course.status}
              </span>
            </div>

            <div className="px-4 pb-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>
                  Instructor: <span className="font-medium text-foreground">{course.instructor}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-accent/5 p-2 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-md bg-primary/10 text-[10px] flex items-center justify-center font-semibold text-primary">
                    DL
                  </span>
                  <span>{course.resources} Resources</span>
                </div>
                <div className="rounded-lg bg-accent/5 p-2 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-md bg-primary/10 text-[10px] flex items-center justify-center font-semibold text-primary">
                    VL
                  </span>
                  <span>Video Lectures</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border bg-transparent px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  onClick={() => router.push(`/student/course-${course.id}`)}
                >
                  <span className="h-5 w-5 rounded-md bg-accent text-[9px] flex items-center justify-center font-semibold">
                    VC
                  </span>
                  View Course
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border bg-transparent px-3 py-1.5 text-xs font-medium hover:bg-accent"
                >
                  <span className="h-5 w-5 rounded-md bg-accent text-[9px] flex items-center justify-center font-semibold">
                    NT
                  </span>
                  Notes
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border bg-transparent px-3 py-1.5 text-xs font-medium hover:bg-accent"
                >
                  <span className="h-5 w-5 rounded-md bg-accent text-[9px] flex items-center justify-center font-semibold">
                    DS
                  </span>
                  Discussion
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
