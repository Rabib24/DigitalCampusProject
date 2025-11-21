"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit,
  Eye,
  FileText
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function AdminFacultyProfileView() {
  const facultyStats = [
    {
      title: "Total Faculty",
      value: "124",
      change: "+3 from last semester",
      icon: Users
    },
    {
      title: "Active Faculty",
      value: "118",
      change: "+2 from last month",
      icon: Users
    },
    {
      title: "On Leave",
      value: "6",
      change: "0 from last month",
      icon: FileText
    },
    {
      title: "New Hires",
      value: "5",
      change: "+2 from last quarter",
      icon: Plus
    }
  ];

  const departmentDistribution = [
    { department: "Computer Science", count: 24, color: "#3b82f6" },
    { department: "Mathematics", count: 18, color: "#10b981" },
    { department: "Physics", count: 15, color: "#f59e0b" },
    { department: "Biology", count: 17, color: "#ef4444" },
    { department: "Chemistry", count: 14, color: "#8b5cf6" },
    { department: "Engineering", count: 22, color: "#06b6d4" },
    { department: "Business", count: 14, color: "#84cc16" }
  ];

  const facultyMembers = [
    { 
      id: "FAC-001", 
      name: "Dr. Jane Smith", 
      department: "Computer Science", 
      position: "Professor",
      email: "j.smith@iub.edu.bd",
      phone: "+1234567890",
      status: "Active"
    },
    { 
      id: "FAC-002", 
      name: "Dr. Robert Johnson", 
      department: "Physics", 
      position: "Associate Professor",
      email: "r.johnson@iub.edu.bd",
      phone: "+1234567891",
      status: "Active"
    },
    { 
      id: "FAC-003", 
      name: "Dr. Emily Davis", 
      department: "Biology", 
      position: "Assistant Professor",
      email: "e.davis@iub.edu.bd",
      phone: "+1234567892",
      status: "On Leave"
    },
    { 
      id: "FAC-004", 
      name: "Dr. Michael Wilson", 
      department: "Mathematics", 
      position: "Professor",
      email: "m.wilson@iub.edu.bd",
      phone: "+1234567893",
      status: "Active"
    },
    { 
      id: "FAC-005", 
      name: "Dr. Sarah Brown", 
      department: "Chemistry", 
      position: "Associate Professor",
      email: "s.brown@iub.edu.bd",
      phone: "+1234567894",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faculty Profile Management</h1>
        <p className="text-muted-foreground">
          Manage faculty profiles, contact information, and employment details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {facultyStats.map((stat, index) => (
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
            <CardTitle>Faculty Distribution by Department</CardTitle>
            <CardDescription>
              Number of faculty members in each department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentDistribution.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.department}</span>
                    <span>{dept.count} faculty</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(dept.count / 30) * 100}%`, 
                        backgroundColor: dept.color 
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
              Common faculty management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Faculty
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Faculty
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Department
              </Button>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Faculty
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faculty Directory</CardTitle>
          <CardDescription>
            List of all faculty members with contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facultyMembers.map((faculty, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{faculty.name}</p>
                  <p className="text-xs text-muted-foreground">{faculty.id} • {faculty.department}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {faculty.email} • {faculty.phone}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Position</p>
                    <p className="text-sm font-medium">{faculty.position}</p>
                  </div>
                  <Badge 
                    variant={
                      faculty.status === "Active" 
                        ? "default" 
                        : faculty.status === "On Leave" 
                        ? "secondary" 
                        : "outline"
                    }
                  >
                    {faculty.status}
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