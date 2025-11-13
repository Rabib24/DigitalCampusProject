"use client"

import { Calendar, Clock, User, MapPin, Plus, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AppointmentSchedulerView() {
  const appointments = [
    {
      id: 1,
      student: "Ahmed Hassan",
      date: "2024-11-20",
      time: "2:00 PM",
      location: "Office A-102",
      status: "confirmed",
    },
    { id: 2, student: "Sarah Khan", date: "2024-11-21", time: "10:00 AM", location: "Virtual", status: "pending" },
    { id: 3, student: "John Doe", date: "2024-11-22", time: "3:30 PM", location: "Office A-102", status: "confirmed" },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Appointment Scheduler</h1>
          <p className="text-muted-foreground">Schedule and manage advisor meetings</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{apt.student}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{apt.date}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{apt.time}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>{apt.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{apt.location}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-1">
                      <Check className="h-3 w-3" />
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                      <X className="h-3 w-3" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Upcoming availability slots</p>
              <div className="space-y-1 mt-4">
                {["Mon 9:00 AM", "Tue 2:00 PM", "Wed 10:00 AM", "Thu 3:30 PM"].map((slot) => (
                  <div key={slot} className="p-2 border rounded hover:bg-muted cursor-pointer">
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
