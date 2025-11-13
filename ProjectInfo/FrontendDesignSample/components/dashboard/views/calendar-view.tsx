"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export function CalendarView() {
  const events = [
    { date: "2025-12-20", type: "Assignment", title: "Data Structures Project Due", course: "CS-203" },
    { date: "2025-12-21", type: "Exam", title: "Physics II Midterm", course: "PH-203" },
    { date: "2025-12-22", type: "Assignment", title: "Literature Analysis Due", course: "EN-102" },
    { date: "2025-12-23", type: "Holiday", title: "Winter Break Starts", course: "General" },
    { date: "2025-12-25", type: "Assignment", title: "Calculus Problem Set Due", course: "MA-101" },
  ]

  const getEventColor = (type: string) => {
    switch (type) {
      case "Assignment":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400"
      case "Exam":
        return "bg-red-500/20 text-red-700 dark:text-red-400"
      case "Holiday":
        return "bg-green-500/20 text-green-700 dark:text-green-400"
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Calendar</h2>
        <p className="text-muted-foreground mt-1">Your academic schedule and important dates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Upcoming Events
          </CardTitle>
          <CardDescription>Next 14 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex items-start gap-4 rounded-lg border border-border p-3">
              <div className="flex-1">
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.course} • {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
              <Badge className={getEventColor(event.type)}>{event.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Important Academic Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-accent/5 p-3">
              <p className="text-xs font-semibold text-muted-foreground">SEMESTER END</p>
              <p className="text-lg font-bold text-foreground mt-1">Dec 30, 2025</p>
            </div>
            <div className="rounded-lg bg-accent/5 p-3">
              <p className="text-xs font-semibold text-muted-foreground">GRADE RELEASE</p>
              <p className="text-lg font-bold text-foreground mt-1">Jan 10, 2026</p>
            </div>
            <div className="rounded-lg bg-accent/5 p-3">
              <p className="text-xs font-semibold text-muted-foreground">SPRING SEMESTER STARTS</p>
              <p className="text-lg font-bold text-foreground mt-1">Jan 20, 2026</p>
            </div>
            <div className="rounded-lg bg-accent/5 p-3">
              <p className="text-xs font-semibold text-muted-foreground">REGISTRATION DEADLINE</p>
              <p className="text-lg font-bold text-foreground mt-1">Jan 15, 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
