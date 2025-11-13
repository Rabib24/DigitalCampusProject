"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, MessageCircle, Video } from "lucide-react"

export function CoursesView() {
  const router = useRouter()

  const courses = [
    {
      id: 1,
      code: "CS-203",
      name: "Data Structures and Algorithms",
      instructor: "Dr. Ahmed Khan",
      credits: 3,
      status: "Active",
      resources: 42,
    },
    {
      id: 2,
      code: "MA-101",
      name: "Calculus I",
      instructor: "Prof. Fatima Ali",
      credits: 4,
      status: "Active",
      resources: 38,
    },
    {
      id: 3,
      code: "EN-102",
      name: "English Literature",
      instructor: "Dr. Sarah Johnson",
      credits: 3,
      status: "Active",
      resources: 25,
    },
    {
      id: 4,
      code: "PH-203",
      name: "Physics II",
      instructor: "Prof. Hassan Malik",
      credits: 4,
      status: "Active",
      resources: 31,
    },
    {
      id: 5,
      code: "EC-101",
      name: "Principles of Economics",
      instructor: "Dr. Aisha Patel",
      credits: 3,
      status: "Active",
      resources: 29,
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">My Courses</h2>
        <p className="text-muted-foreground mt-1">You are enrolled in 5 courses this semester</p>
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
                    {course.code} • {course.credits} Credits
                  </CardDescription>
                </div>
                <Badge>{course.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>
                    Instructor: <span className="font-medium text-foreground">{course.instructor}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-accent/5 p-2 flex items-center gap-2">
                    <Download size={16} className="text-primary" />
                    <span>{course.resources} Resources</span>
                  </div>
                  <div className="rounded-lg bg-accent/5 p-2 flex items-center gap-2">
                    <Video size={16} className="text-primary" />
                    <span>Video Lectures</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => router.push(`/student/course-${course.id}`)}
                  >
                    <Download size={16} />
                    View Course
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <BookOpen size={16} />
                    Notes
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <MessageCircle size={16} />
                    Discussion
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
