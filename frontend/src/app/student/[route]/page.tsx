"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseDetailPage } from "@/components/student/pages/course-detail";
import { AssignmentDetailPage } from "@/components/student/pages/assignment-detail";
import { SubmitAssignmentPage } from "@/components/student/pages/submit-assignment";
import { GradesDetailPage } from "@/components/student/pages/grades-detail";

export default function StudentRoutePage() {
  const router = useRouter();
  const params = useParams();
  const route = params.route as string;
  const segments = route.split("-");
  const courseId = segments[segments.length - 1];

  const renderPage = () => {
    switch (true) {
      case route.startsWith("course-"):
        return <CourseDetailPage courseId={courseId} />;
      case route.startsWith("assignment-detail-"):
        return <AssignmentDetailPage assignmentId={route.split("-").pop() || ""} />;
      case route.startsWith("submit-assignment-"):
        return <SubmitAssignmentPage assignmentId={route.split("-").pop() || ""} />;
      case route === "grades-detail":
        return <GradesDetailPage />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="p-4 md:p-6">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 mb-6 bg-transparent"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        {renderPage()}
      </div>
    </div>
  );
}
