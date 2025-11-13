"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CourseEditPageProps {
  courseId: string
}

export function CourseEditPage({ courseId }: CourseEditPageProps) {
  const router = useRouter()
  const [courseName, setCourseName] = useState("Data Science and Machine Learning")
  const [courseCode, setCourseCode] = useState("CS-301")
  const [description, setDescription] = useState(
    "An introductory course to data science and machine learning techniques.",
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert("Course updated successfully!")
      router.back()
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Course</h1>
        <p className="text-muted-foreground">Course ID: {courseId}</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g., CS-301"
                />
              </div>
              <div>
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter course description"
                  rows={5}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input id="credits" defaultValue={3} type="number" />
                </div>
                <div>
                  <Label htmlFor="capacity">Enrollment Capacity</Label>
                  <Input id="capacity" defaultValue={32} type="number" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" defaultValue="2024-09-01" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" defaultValue="2024-12-15" />
                </div>
              </div>
              <div>
                <Label>Class Meetings</Label>
                <div className="space-y-2 mt-2">
                  {["Monday 10:00 AM - 11:30 AM", "Wednesday 10:00 AM - 11:30 AM", "Friday 10:00 AM - 11:30 AM"].map(
                    (day, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{day}</span>
                        <Button size="sm" variant="ghost">
                          Remove
                        </Button>
                      </div>
                    ),
                  )}
                </div>
                <Button variant="outline" className="mt-4 w-full bg-transparent">
                  Add Class Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gradingScale">Grading Scale</Label>
                <Input id="gradingScale" defaultValue="A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: Below 60" />
              </div>
              <div>
                <Label htmlFor="passingGrade">Passing Grade</Label>
                <Input id="passingGrade" defaultValue="60" type="number" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="allowLate" defaultChecked />
                <Label htmlFor="allowLate">Allow Late Submissions</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="flex-1">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
