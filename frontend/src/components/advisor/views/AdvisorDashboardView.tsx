"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, BarChart3, Award, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdvisorDashboardView() {
  const stats = [
    {
      title: "Advisees",
      value: "42",
      description: "+3 from last semester",
      icon: Users,
    },
    {
      title: "Upcoming Appointments",
      value: "8",
      description: "This week",
      icon: Calendar,
    },
    {
      title: "Pending Reviews",
      value: "12",
      description: "Assignments and projects",
      icon: FileText,
    },
    {
      title: "Average GPA",
      value: "3.7",
      description: "+0.1 from last term",
      icon: Award,
    },
  ];

  const advisees = [
    { id: "STU-001", name: "John Doe", major: "Computer Science", gpa: "3.8", status: "On Track" },
    { id: "STU-002", name: "Jane Smith", major: "Mathematics", gpa: "3.9", status: "Excellent" },
    { id: "STU-003", name: "Robert Johnson", major: "Physics", gpa: "3.2", status: "Needs Attention" },
    { id: "STU-004", name: "Emily Davis", major: "Biology", gpa: "3.6", status: "On Track" },
  ];

  const upcomingAppointments = [
    { student: "John Doe", time: "2023-06-15 10:00 AM", type: "Academic Progress" },
    { student: "Jane Smith", time: "2023-06-15 2:00 PM", type: "Research Discussion" },
    { student: "Robert Johnson", time: "2023-06-16 9:00 AM", type: "Academic Support" },
    { student: "Emily Davis", time: "2023-06-16 3:00 PM", type: "Course Planning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advisor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your advisees and track their academic progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Advisees Overview</CardTitle>
            <CardDescription>
              Current academic status of your advisees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advisees.map((advisee, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{advisee.name}</p>
                    <p className="text-xs text-muted-foreground">{advisee.major} • {advisee.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">GPA: {advisee.gpa}</p>
                    <p className={`text-xs ${
                      advisee.status === "Excellent" 
                        ? "text-green-500" 
                        : advisee.status === "On Track" 
                        ? "text-blue-500" 
                        : "text-yellow-500"
                    }`}>
                      {advisee.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Scheduled meetings with your advisees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{appointment.student}</p>
                    <p className="text-xs text-muted-foreground">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{new Date(appointment.time).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common advisor tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View All Advisees
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Review Submissions
            </Button>
            <Button variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}