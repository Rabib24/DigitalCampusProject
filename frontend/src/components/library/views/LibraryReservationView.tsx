"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Check,
  X
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function LibraryReservationView() {
  const reservationStats = [
    {
      title: "Total Reservations",
      value: "247",
      change: "+32 from last week",
      icon: Calendar
    },
    {
      title: "Active Reservations",
      value: "89",
      change: "+12 from yesterday",
      icon: Calendar
    },
    {
      title: "Completed Today",
      value: "24",
      change: "+5 from yesterday",
      icon: Check
    },
    {
      title: "Cancelled Today",
      value: "3",
      change: "-1 from yesterday",
      icon: X
    }
  ];

  const reservationTrends = [
    { day: "Mon", reservations: 32, completed: 18 },
    { day: "Tue", reservations: 38, completed: 22 },
    { day: "Wed", reservations: 29, completed: 15 },
    { day: "Thu", reservations: 41, completed: 24 },
    { day: "Fri", reservations: 35, completed: 20 },
    { day: "Sat", reservations: 18, completed: 8 },
    { day: "Sun", reservations: 12, completed: 5 }
  ];

  const reservations = [
    { 
      id: "RES-001", 
      title: "Introduction to Algorithms", 
      patron: "John Doe",
      reservationDate: "2023-06-15",
      pickupDate: "2023-06-16",
      dueDate: "2023-06-23",
      status: "Active"
    },
    { 
      id: "RES-002", 
      title: "Machine Learning Basics", 
      patron: "Jane Smith",
      reservationDate: "2023-06-14",
      pickupDate: "2023-06-15",
      dueDate: "2023-06-22",
      status: "Picked Up"
    },
    { 
      id: "RES-003", 
      title: "Quantum Physics Fundamentals", 
      patron: "Robert Johnson",
      reservationDate: "2023-06-14",
      pickupDate: "2023-06-17",
      dueDate: "2023-06-24",
      status: "Active"
    },
    { 
      id: "RES-004", 
      title: "Biology Research Methods", 
      patron: "Emily Davis",
      reservationDate: "2023-06-13",
      pickupDate: "2023-06-14",
      dueDate: "2023-06-21",
      status: "Completed"
    },
    { 
      id: "RES-005", 
      title: "Chemistry Lab Manual", 
      patron: "Michael Wilson",
      reservationDate: "2023-06-13",
      pickupDate: "2023-06-15",
      dueDate: "2023-06-22",
      status: "Cancelled"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reservation System</h1>
        <p className="text-muted-foreground">
          Manage book reservations, track pickup status, and monitor reservation trends.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reservationStats.map((stat, index) => (
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
            <CardTitle>Reservation Trends</CardTitle>
            <CardDescription>
              New reservations and completions over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reservationTrends}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservations" fill="#3b82f6" name="New Reservations" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common reservation management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Reservation
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Reservations
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
          <CardTitle>Reservation Details</CardTitle>
          <CardDescription>
            List of current and recent reservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.map((reservation, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{reservation.title}</p>
                  <p className="text-xs text-muted-foreground">{reservation.id} • Patron: {reservation.patron}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Reservation Date</p>
                    <p className="text-sm font-medium">{reservation.reservationDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Pickup Date</p>
                    <p className="text-sm font-medium">{reservation.pickupDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">{reservation.dueDate}</p>
                  </div>
                  <Badge 
                    variant={
                      reservation.status === "Active" 
                        ? "default" 
                        : reservation.status === "Picked Up" 
                        ? "secondary" 
                        : reservation.status === "Completed" 
                        ? "outline" 
                        : "destructive"
                    }
                  >
                    {reservation.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
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