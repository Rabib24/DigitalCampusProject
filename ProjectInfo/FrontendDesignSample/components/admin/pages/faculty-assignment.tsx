"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function FacultyAssignmentPage({ courseId }: { courseId: string }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Assign Faculty to Course</h2>
        <p className="text-muted-foreground mt-1">Select and assign faculty members to courses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Assignment Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Course</Label>
            <div className="mt-2 p-3 rounded-lg border border-border bg-muted text-foreground">
              Data Science (CS-301)
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Select Faculty Member</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a faculty member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ahmed">Dr. Ahmed Khan</SelectItem>
                <SelectItem value="sarah">Dr. Sarah Smith</SelectItem>
                <SelectItem value="fatima">Dr. Fatima Ali</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Semester</Label>
            <div className="mt-2 p-3 rounded-lg border border-border bg-muted text-foreground">Fall 2025</div>
          </div>

          <div>
            <Label className="text-sm font-medium">Teaching Load</Label>
            <div className="mt-2 p-3 rounded-lg border border-border bg-muted text-foreground">Credit Hours: 3</div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-900">Current assignment: Dr. Ahmed Khan (Active)</p>
          </div>

          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90">Confirm Assignment</Button>
            <Button variant="outline" className="bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
