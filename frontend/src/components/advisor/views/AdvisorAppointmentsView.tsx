"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorAppointmentsView() {
  const appointmentStats = [
    {
      title: "Total Appointments",
      value: "24",
      change: "+3 from last week",
      icon: Calendar
    },
    {
      title: "Completed",
      value: "18",
      change: "+2 from last week",
      icon: Check
    },
    {
      title: "Pending",
      value: "4",
      change: "0 from yesterday",
      icon: Clock
    },
    {
      title: "Cancelled",
      value: "2",
      change: "0 from yesterday",
      icon: X
    }
  ];

  const weeklyAppointments = [
    { day: "Mon", scheduled: 5, completed: 4 },
    { day: "Tue", scheduled: 6, completed: 5 },
    { day: "Wed", scheduled: 4, completed: 4 },
    { day: "Thu", scheduled: 7, completed: 6 },
    { day: "Fri", scheduled: 2, completed: 1 }
  ];

  const appointments = [
    { 
      id: "APT-001", 
      student: "John Doe", 
      time: "2023-06-19 10:00 AM", 
      type: "Academic Progress",
      status: "Confirmed",
      duration: "30 min",
      location: "Room 205"
    },
    { 
      id: "APT-002", 
      student: "Jane Smith", 
      time: "2023-06-19 2:00 PM", 
      type: "Research Discussion",
      status: "Confirmed",
      duration: "45 min",
      location: "Online"
    },
    { 
      id: "APT-003", 
      student: "Robert Johnson", 
      time: "2023-06-20 9:00 AM", 
      type: "Academic Support",
      status: "Pending",
      duration: "30 min",
      location: "Room 312"
    },
    { 
      id: "APT-004", 
      student: "Emily Davis", 
      time: "2023-06-20 3:00 PM", 
      type: "Course Planning",
      status: "Confirmed",
      duration: "60 min",
      location: "Room 205"
    },
    { 
      id: "APT-005", 
      student: "Michael Wilson", 
      time: "2023-06-21 11:00 AM", 
      type: "Career Guidance",
      status: "Cancelled",
      duration: "30 min",
      location: "Room 108"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Appointment Management</h1>
        <p className="text-muted-foreground">
          Schedule, manage, and track appointments with your advisees.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {appointmentStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Appointments</CardTitle>
            <CardDescription>
              Scheduled vs completed appointments this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyAppointments}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scheduled" fill="#3b82f6" name="Scheduled" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common appointment management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Appointments
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            Scheduled meetings with your advisees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{appointment.student}</p>
                  <p className="text-xs text-muted-foreground">{appointment.id} • {appointment.type}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="text-sm font-medium">{new Date(appointment.time).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-sm font-medium">{appointment.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-medium">{appointment.duration}</p>
                  </div>
                  <Badge 
                    variant={
                      appointment.status === "Confirmed" 
                        ? "default" 
                        : appointment.status === "Pending" 
                        ? "secondary" 
                        : appointment.status === "Cancelled" 
                        ? "destructive" 
                        : "outline"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}