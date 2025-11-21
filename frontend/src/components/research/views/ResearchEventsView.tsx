"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Users,
  MapPin,
  Clock,
  Eye,
  Edit
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchEventsView() {
  const eventStats = [
    {
      title: "Total Events",
      value: "24",
      change: "+3 from last quarter",
      icon: Calendar
    },
    {
      title: "Upcoming Events",
      value: "8",
      change: "+2 from next month",
      icon: Clock
    },
    {
      title: "Attendees",
      value: "1,240",
      change: "+120 from last event",
      icon: Users
    },
    {
      title: "Event Types",
      value: "5",
      change: "Workshops, Conferences, Seminars",
      icon: Calendar
    }
  ];

  const eventAttendance = [
    { month: "Jan", attendees: 180, events: 3 },
    { month: "Feb", attendees: 220, events: 4 },
    { month: "Mar", attendees: 190, events: 3 },
    { month: "Apr", attendees: 250, events: 5 },
    { month: "May", attendees: 210, events: 4 },
    { month: "Jun", attendees: 180, events: 3 }
  ];

  const events = [
    { 
      id: "EVENT-001", 
      title: "Machine Learning Workshop", 
      type: "Workshop", 
      date: "2023-06-25",
      time: "10:00 AM - 4:00 PM",
      location: "Room 101, Science Building",
      attendees: 45,
      status: "Confirmed"
    },
    { 
      id: "EVENT-002", 
      title: "International Research Conference", 
      type: "Conference", 
      date: "2023-07-15",
      time: "9:00 AM - 5:00 PM",
      location: "Main Auditorium",
      attendees: 200,
      status: "Planned"
    },
    { 
      id: "EVENT-003", 
      title: "Quantum Computing Seminar", 
      type: "Seminar", 
      date: "2023-06-30",
      time: "2:00 PM - 4:00 PM",
      location: "Room 205, Engineering Building",
      attendees: 32,
      status: "Confirmed"
    },
    { 
      id: "EVENT-004", 
      title: "Climate Change Symposium", 
      type: "Symposium", 
      date: "2023-07-22",
      time: "10:00 AM - 6:00 PM",
      location: "Conference Center",
      attendees: 150,
      status: "Planned"
    },
    { 
      id: "EVENT-005", 
      title: "Biomedical Engineering Workshop", 
      type: "Workshop", 
      date: "2023-06-20",
      time: "1:00 PM - 5:00 PM",
      location: "Lab 301, Biology Building",
      attendees: 28,
      status: "Completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Events Management</h1>
        <p className="text-muted-foreground">
          Plan, organize, and manage research events and conferences.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {eventStats.map((stat, index) => (
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
            <CardTitle>Event Attendance</CardTitle>
            <CardDescription>
              Attendees and events over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventAttendance}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="attendees" fill="#3b82f6" name="Attendees" />
                <Bar yAxisId="right" dataKey="events" fill="#10b981" name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common event management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Event
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Events
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Type
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
          <CardTitle>Research Events</CardTitle>
          <CardDescription>
            List of upcoming, planned, and past events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.id} • {event.type}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Date & Time</p>
                    <p className="text-sm font-medium">{event.date}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Attendees</p>
                    <p className="text-sm font-medium">{event.attendees}</p>
                  </div>
                  <Badge 
                    variant={
                      event.status === "Confirmed" 
                        ? "default" 
                        : event.status === "Planned" 
                        ? "secondary" 
                        : event.status === "Completed" 
                        ? "outline" 
                        : "destructive"
                    }
                  >
                    {event.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}