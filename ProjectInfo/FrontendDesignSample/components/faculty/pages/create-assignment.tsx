"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CreateAssignmentPageProps {
  courseId: string
}

export function CreateAssignmentPage({ courseId }: CreateAssignmentPageProps) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "homework",
    points: 100,
    dueDate: "",
    allowLate: false,
    latePenalty: 10,
  })

  const handleSubmit = () => {
    setIsCreating(true)
    setTimeout(() => {
      setIsCreating(false)
      alert("Assignment created successfully!")
      router.back()
    }, 1000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Create New Assignment</h1>
        <p className="text-muted-foreground">Course ID: {courseId}</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="rubric">Rubric</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Assignment Title</Label>
                <Input
                  id="title"
                  placeholder="Enter assignment title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter detailed assignment description"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Assignment Type</Label>
                  <select
                    id="type"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="homework">Homework</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="points">Total Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Due Date & Submission Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dueDate">Due Date & Time</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowLate"
                  checked={formData.allowLate}
                  onChange={(e) => setFormData({ ...formData, allowLate: e.target.checked })}
                />
                <Label htmlFor="allowLate">Allow Late Submissions</Label>
              </div>
              {formData.allowLate && (
                <div>
                  <Label htmlFor="penalty">Late Penalty (%)</Label>
                  <Input
                    id="penalty"
                    type="number"
                    value={formData.latePenalty}
                    onChange={(e) => setFormData({ ...formData, latePenalty: Number.parseInt(e.target.value) })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rubric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grading Rubric</CardTitle>
              <CardDescription>Define grading criteria for this assignment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {["Correctness", "Code Quality", "Documentation", "Submission Format"].map((criterion, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                    <span className="font-medium">{criterion}</span>
                    <Input type="number" placeholder="Points" className="w-24" defaultValue={25} />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Add Criterion
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isCreating} className="flex-1">
          {isCreating ? "Creating..." : "Create Assignment"}
        </Button>
      </div>
    </div>
  )
}
