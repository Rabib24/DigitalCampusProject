"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CourseDetailPage({ courseId }: { courseId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Course Details</h2>
        <p className="text-muted-foreground mt-1">Edit and manage course information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Course Code</Label>
              <Input defaultValue="CS-301" className="mt-2" readOnly />
            </div>
            <div>
              <Label className="text-sm">Course Name</Label>
              <Input defaultValue="Data Science" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Credits</Label>
              <Input defaultValue="3" type="number" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Capacity</Label>
              <Input defaultValue="40" type="number" className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Assigned Faculty</Label>
              <Input defaultValue="Dr. Ahmed Khan" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Semester</Label>
              <Input defaultValue="Fall 2025" className="mt-2" readOnly />
            </div>
            <div>
              <Label className="text-sm">Status</Label>
              <Badge className="mt-2">Active</Badge>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 mt-4">Update Assignment</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrollment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Enrolled Students</p>
              <p className="text-2xl font-bold mt-1">32</p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Available Seats</p>
              <p className="text-2xl font-bold mt-1">8</p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Utilization</p>
              <p className="text-2xl font-bold mt-1">80%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
