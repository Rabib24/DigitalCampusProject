"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Calendar } from "lucide-react"

export function TimetableManagementView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Timetable Management</h2>
          <p className="text-muted-foreground mt-1">Create and manage academic schedules</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={18} />
          Create Schedule
        </Button>
      </div>

      {/* Alerts */}
      <Alert className="border-destructive/50 bg-destructive/5">
        <AlertCircle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive ml-2">
          2 scheduling conflicts detected between CS-301 and CS-401
        </AlertDescription>
      </Alert>

      {/* Timetable Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">168</div>
            <p className="text-xs text-muted-foreground mt-1">Weekly slots</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Slots Filled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">154</div>
            <p className="text-xs text-muted-foreground mt-1">92% utilization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground mt-1">Across campus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground mt-1">Need resolution</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Weekly Schedule Overview
          </CardTitle>
          <CardDescription>Current semester schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24 font-semibold text-sm">{day}</div>
                <div className="flex-1 h-8 bg-muted rounded-lg relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50"
                    style={{ width: "85%" }}
                  />
                </div>
                <span className="text-sm font-medium w-16">85%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Schedule Changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between p-3 rounded-lg border border-border">
            <div>
              <h4 className="font-semibold text-sm">CS-301 Time Changed</h4>
              <p className="text-xs text-muted-foreground mt-1">Mon 10:00 AM → Mon 11:00 AM</p>
            </div>
            <Badge>Changed</Badge>
          </div>
          <div className="flex items-start justify-between p-3 rounded-lg border border-border">
            <div>
              <h4 className="font-semibold text-sm">Room Assignment: CS-401</h4>
              <p className="text-xs text-muted-foreground mt-1">Room 205 → Room 301</p>
            </div>
            <Badge>Changed</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
