"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TimetableDetailPage({ timetableId }: { timetableId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Timetable Details</h2>
        <p className="text-muted-foreground mt-1">View and manage course schedules</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Schedule Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Course</Label>
              <div className="mt-2 p-2 rounded border border-border bg-muted text-sm">Data Science (CS-301)</div>
            </div>
            <div>
              <Label className="text-sm">Day</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue defaultValue="monday" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Time</Label>
              <div className="mt-2 p-2 rounded border border-border bg-muted text-sm">10:00 AM - 11:30 AM</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Room Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Room</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue defaultValue="205" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="205">Room 205</SelectItem>
                  <SelectItem value="301">Room 301</SelectItem>
                  <SelectItem value="410">Room 410</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Capacity</Label>
              <div className="mt-2 p-2 rounded border border-border bg-muted text-sm">50</div>
            </div>
            <div>
              <Label className="text-sm">Current Enrollment</Label>
              <Badge className="mt-2">32 / 50</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90">Save Schedule</Button>
        <Button variant="outline" className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
