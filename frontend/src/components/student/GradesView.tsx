"use client";

import { useRouter } from "next/navigation";
import { mockCourseGrades } from "@/components/student/mockData";

export function GradesView() {
  const router = useRouter();
  const courseGrades = mockCourseGrades;

  const gradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600 dark:text-green-400";
    if (grade.startsWith("B")) return "text-blue-600 dark:text-blue-400";
    if (grade.startsWith("C")) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Grades</h2>
        <p className="text-muted-foreground mt-1">Your academic performance this semester</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card">
          <div className="px-4 pt-4 pb-2">
            <p className="text-sm font-medium">Current CGPA</p>
          </div>
          <div className="px-4 pb-4">
            <div className="text-4xl font-bold text-primary">3.55</div>
            <p className="text-xs text-muted-foreground mt-2">Based on completed courses</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="px-4 pt-4 pb-2">
            <p className="text-sm font-medium">Semester GPA</p>
          </div>
          <div className="px-4 pb-4">
            <div className="text-4xl font-bold text-primary">3.65</div>
            <p className="text-xs text-muted-foreground mt-2">This semester</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="px-4 pt-4 pb-2">
            <p className="text-sm font-medium">Status</p>
          </div>
          <div className="px-4 pb-4 flex flex-col gap-2">
            <span className="inline-flex items-center rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-500">
              In Good Standing
            </span>
            <p className="text-xs text-muted-foreground">No academic alerts</p>
          </div>
        </div>
      </div>

      {/* Grade Distribution (simple bar chart approximation) */}
      <div className="rounded-lg border bg-card">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-base font-semibold">Grade Distribution</h3>
          <p className="text-xs text-muted-foreground">Your grades across courses</p>
        </div>
        <div className="px-4 pb-4 space-y-3">
          {courseGrades.map((course, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{course.course}</span>
                <span>{course.percentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${course.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Grades Table */}
      <div className="rounded-lg border bg-card">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-base font-semibold">Course Grades</h3>
          <p className="text-xs text-muted-foreground">Detailed breakdown of your grades</p>
        </div>
        <div className="px-4 pb-4 space-y-3">
          {courseGrades.map((course, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{course.course}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-bold ${gradeColor(course.grade)}`}>
                  {course.grade}
                </span>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {course.percentage}%
                </span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${course.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="mt-4 w-full h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            onClick={() => router.push("/student/grades-detail")}
          >
            View Detailed Grades
          </button>
        </div>
      </div>
    </div>
  );
}
