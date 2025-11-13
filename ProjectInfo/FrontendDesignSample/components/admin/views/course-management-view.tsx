"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Edit, Trash2, Plus, Search } from "lucide-react"

export function CourseManagementView() {
  const router = useRouter()

  const courses = [
    { id: 1, code: "CS-301", name: "Data Science", faculty: "Dr. Ahmed", students: 32, status: "Active" },
    { id: 2, code: "CS-401", name: "Capstone Project", faculty: "Dr. Sarah", students: 18, status: "Active" },
    { id: 3, code: "CS-205", name: "Web Development", faculty: "Dr. Khan", students: 45, status: "Active" },
    { id: 4, code: "CS-101", name: "Intro to CS", faculty: "Dr. Ali", students: 150, status: "Active" },
    { id: 5, code: "CS-502", name: "Advanced ML", faculty: "Dr. Fatima", students: 0, status: "Planned" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Course Management</h2>
          <p className="text-muted-foreground mt-1">Manage department courses and curriculum</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Create Course
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input placeholder="Search courses..." className="pl-10" />
        </div>
        <Button variant="outline" className="bg-transparent">
          Filter
        </Button>
      </div>

      {/* Courses Table - Responsive Cards */}
      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border border-border p-4 hover:bg-accent/5 transition-colors cursor-pointer"
            onClick={() => router.push(`/admin/course-${course.id}`)}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">{course.code}</h4>
                    <p className="text-sm text-muted-foreground">{course.name}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Faculty</p>
                    <p className="font-medium">{course.faculty}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Students</p>
                    <p className="font-medium">{course.students}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="mt-1" variant={course.status === "Active" ? "default" : "outline"}>
                      {course.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => router.push(`/admin/course-${course.id}`)}
                >
                  <Edit size={16} />
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent text-destructive">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
