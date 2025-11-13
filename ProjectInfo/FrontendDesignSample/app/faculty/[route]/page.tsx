"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CourseEditPage } from "@/components/faculty/pages/course-edit"
import { ManageStudentsPage } from "@/components/faculty/pages/manage-students"
import { CreateAssignmentPage } from "@/components/faculty/pages/create-assignment"
import { EditAssignmentPage } from "@/components/faculty/pages/edit-assignment"
import { ViewSubmissionsPage } from "@/components/faculty/pages/view-submissions"
import { GradebookDetailPage } from "@/components/faculty/pages/gradebook-detail"

export default function FacultyPage() {
  const router = useRouter()
  const params = useParams()
  const route = params.route as string

  const renderPage = () => {
    const [action, ...rest] = route.split("-")
    const id = rest.join("-")

    switch (true) {
      case route.startsWith("course-edit-"):
        return <CourseEditPage courseId={id} />
      case route.startsWith("manage-students-"):
        return <ManageStudentsPage courseId={id} />
      case route.startsWith("create-assignment-"):
        return <CreateAssignmentPage courseId={id} />
      case route.startsWith("edit-assignment-"):
        return <EditAssignmentPage assignmentId={id} />
      case route.startsWith("view-submissions-"):
        return <ViewSubmissionsPage assignmentId={id} />
      case route.startsWith("gradebook-"):
        return <GradebookDetailPage courseId={id} />
      default:
        return <div>Page not found</div>
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
