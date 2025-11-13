"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Settings, Users, Plus } from "lucide-react"

export function FacultyCoursesView() {
  const router = useRouter()

  const courses = [
    {
      id: 1,
      code: "CS-301",
      name: "Data Science and Machine Learning",
      semester: "Fall 2024",
      students: 32,
      credits: 3,
      status: "Active",
    },
    {
      id: 2,
      code: "CS-401",
      name: "Capstone Project",
      semester: "Fall 2024",
      students: 18,
      credits: 4,
      status: "Active",
    },
    {
      id: 3,
      code: "CS-205",
      name: "Web Development and Modern Frameworks",
      semester: "Fall 2024",
      students: 45,
      credits: 3,
      status: "Active",
    },
    {
      id: 4,
      code: "CS-101",
      name: "Introduction to Computer Science",
      semester: "Fall 2024",
      students: 150,
      credits: 3,
      status: "Active",
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Classes</h2>
          <p className="text-muted-foreground mt-1">Manage your active courses</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Create Course
        </Button>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BookOpen size={20} className="text-primary" />
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    {course.code} • {course.credits} Credits • {course.semester}
                  </CardDescription>
                </div>
                <Badge>{course.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span>{course.students} Students Enrolled</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {[
                    { label: "Syllabus", icon: "📄" },
                    { label: "Gradebook", icon: "📊" },
                    { label: "Assignments", icon: "📋" },
                    { label: "Discussion", icon: "💬" },
                  ].map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-accent/5 p-2 flex items-center gap-2 text-center">
                      <span>{item.icon}</span>
                      <span className="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => router.push(`/faculty/course-edit-${course.id}`)}
                  >
                    <Settings size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => router.push(`/faculty/manage-students-${course.id}`)}
                  >
                    <Users size={16} />
                    Manage Students
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
