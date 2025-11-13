"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseDetailPage } from "@/components/admin/pages/course-detail"
import { FacultyAssignmentPage } from "@/components/admin/pages/faculty-assignment"
import { TimetableDetailPage } from "@/components/admin/pages/timetable-detail"
import { BudgetAllocationPage } from "@/components/admin/pages/budget-allocation"
import { StudentEnrollmentPage } from "@/components/admin/pages/student-enrollment"

export default function AdminDetailPage() {
  const router = useRouter()
  const params = useParams()
  const route = params.route as string

  const renderPage = () => {
    switch (true) {
      case route.startsWith("course-"):
        return <CourseDetailPage courseId={route.split("-").pop() || ""} />
      case route.startsWith("faculty-assign-"):
        return <FacultyAssignmentPage courseId={route.split("-").pop() || ""} />
      case route.startsWith("timetable-"):
        return <TimetableDetailPage timetableId={route.split("-").pop() || ""} />
      case route.startsWith("budget-"):
        return <BudgetAllocationPage budgetId={route.split("-").pop() || ""} />
      case route.startsWith("students-"):
        return <StudentEnrollmentPage courseId={route.split("-").pop() || ""} />
      default:
        return <div className="p-6">Page not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <div className="p-4 md:p-6">
        <Button variant="outline" size="sm" className="gap-2 mb-6 bg-transparent" onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Back
        </Button>
        {renderPage()}
      </div>
    </div>
  )
}
