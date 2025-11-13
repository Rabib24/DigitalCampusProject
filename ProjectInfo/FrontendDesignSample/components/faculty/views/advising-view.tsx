"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, AlertTriangle } from "lucide-react"

export function AdvisingView() {
  const advisees = [
    { id: "S001", name: "Ali Ahmed", cgpa: 3.45, status: "Good", nextMeeting: "2024-12-15", warning: false },
    { id: "S002", name: "Fatima Khan", cgpa: 3.8, status: "Excellent", nextMeeting: "2024-12-20", warning: false },
    { id: "S003", name: "Hassan Ali", cgpa: 2.8, status: "Warning", nextMeeting: "2024-12-12", warning: true },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Student Advising</h2>
          <p className="text-muted-foreground mt-1">Manage academic advising for 18 students</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Calendar size={18} />
          Schedule Meeting
        </Button>
      </div>

      {/* Academic Warning Alert */}
      <Alert className="border-destructive/50 bg-destructive/5">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertTitle>Academic Alerts</AlertTitle>
        <AlertDescription>2 students have GPA below 3.0 - consider scheduling advising meetings</AlertDescription>
      </Alert>

      {/* Advisee Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {advisees.map((student) => (
          <Card
            key={student.id}
            className={`hover:shadow-md transition-shadow ${student.warning ? "border-destructive/50" : ""}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{student.name}</CardTitle>
                  <CardDescription>{student.id}</CardDescription>
                </div>
                <Badge variant={student.warning ? "destructive" : student.cgpa >= 3.5 ? "default" : "secondary"}>
                  {student.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Current CGPA</p>
                <p className="text-2xl font-bold text-primary">{student.cgpa}</p>
              </div>
              <div className="text-sm text-muted-foreground">Next Meeting: {student.nextMeeting}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-transparent flex-1">
                  View Progress
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 flex-1">
                  Meet
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What-if Simulator */}
      <Card>
        <CardHeader>
          <CardTitle>CGPA Simulator</CardTitle>
          <CardDescription>Plan course retakes and grade improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Select Student</label>
                <select className="w-full mt-2 p-2 border border-border rounded-md bg-background">
                  <option>Ali Ahmed</option>
                  <option>Fatima Khan</option>
                  <option>Hassan Ali</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Projected New Grade</label>
                <select className="w-full mt-2 p-2 border border-border rounded-md bg-background">
                  <option>A (4.0)</option>
                  <option>A- (3.7)</option>
                  <option>B+ (3.3)</option>
                  <option>B (3.0)</option>
                </select>
              </div>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90">Calculate New CGPA</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
