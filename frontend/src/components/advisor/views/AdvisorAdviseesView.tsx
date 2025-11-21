"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  TrendingUp,
  Award
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdvisorAdviseesView() {
  const adviseeStats = [
    {
      title: "Total Advisees",
      value: "42",
      change: "+3 from last semester",
      icon: Users
    },
    {
      title: "High Achievers",
      value: "18",
      change: "+2 from last term",
      icon: Award
    },
    {
      title: "At Risk",
      value: "5",
      change: "-2 from intervention",
      icon: TrendingUp
    },
    {
      title: "New This Term",
      value: "7",
      change: "+7 from enrollment",
      icon: Plus
    }
  ];

  const gpaDistribution = [
    { range: "3.5-4.0", count: 18, color: "#10b981" },
    { range: "3.0-3.49", count: 15, color: "#3b82f6" },
    { range: "2.5-2.99", count: 6, color: "#f59e0b" },
    { range: "<2.5", count: 3, color: "#ef4444" }
  ];

  const advisees = [
    { 
      id: "STU-001", 
      name: "John Doe", 
      major: "Computer Science", 
      gpa: 3.8, 
      status: "Excellent",
      credits: 95,
      advisor: "Dr. Smith",
      email: "j.doe@iub.edu.bd"
    },
    { 
      id: "STU-002", 
      name: "Jane Smith", 
      major: "Mathematics", 
      gpa: 3.9, 
      status: "Excellent",
      credits: 88,
      advisor: "Dr. Johnson",
      email: "j.smith@iub.edu.bd"
    },
    { 
      id: "STU-003", 
      name: "Robert Johnson", 
      major: "Physics", 
      gpa: 3.2, 
      status: "On Track",
      credits: 76,
      advisor: "Dr. Williams",
      email: "r.johnson@iub.edu.bd"
    },
    { 
      id: "STU-004", 
      name: "Emily Davis", 
      major: "Biology", 
      gpa: 3.6, 
      status: "Excellent",
      credits: 102,
      advisor: "Dr. Brown",
      email: "e.davis@iub.edu.bd"
    },
    { 
      id: "STU-005", 
      name: "Michael Wilson", 
      major: "Chemistry", 
      gpa: 2.8, 
      status: "Needs Attention",
      credits: 65,
      advisor: "Dr. Davis",
      email: "m.wilson@iub.edu.bd"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advisee Management</h1>
        <p className="text-muted-foreground">
          Manage and track the academic progress of your advisees.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {adviseeStats.map((stat, index) => (
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
            <CardTitle>GPA Distribution</CardTitle>
            <CardDescription>
              Distribution of advisees by GPA range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gpaDistribution.map((gpa, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{gpa.range}</span>
                    <span>{gpa.count} students</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(gpa.count / 20) * 100}%`, 
                        backgroundColor: gpa.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for managing advisees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Advisee
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Advisees
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advisee List</CardTitle>
          <CardDescription>
            Detailed information about your advisees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {advisees.map((advisee, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{advisee.name}</p>
                  <p className="text-xs text-muted-foreground">{advisee.id} • {advisee.major}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">GPA</p>
                    <p className="text-sm font-medium">{advisee.gpa}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="text-sm font-medium">{advisee.credits}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Advisor</p>
                    <p className="text-sm font-medium">{advisee.advisor}</p>
                  </div>
                  <Badge 
                    variant={
                      advisee.status === "Excellent" 
                        ? "default" 
                        : advisee.status === "On Track" 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {advisee.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
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