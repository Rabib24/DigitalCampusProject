"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Award,
  TrendingUp,
  Eye,
  Edit
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchResearchersView() {
  const researcherStats = [
    {
      title: "Total Researchers",
      value: "89",
      change: "+5 new researchers",
      icon: Users
    },
    {
      title: "Active Researchers",
      value: "76",
      change: "+3 from last month",
      icon: Users
    },
    {
      title: "Research Fellows",
      value: "24",
      change: "+2 from last quarter",
      icon: Award
    },
    {
      title: "Visiting Scholars",
      value: "13",
      change: "0 from last month",
      icon: Users
    }
  ];

  const researcherActivity = [
    { month: "Jan", active: 65, new: 3 },
    { month: "Feb", active: 68, new: 2 },
    { month: "Mar", active: 72, new: 4 },
    { month: "Apr", active: 70, new: 1 },
    { month: "May", active: 74, new: 3 },
    { month: "Jun", active: 76, new: 2 }
  ];

  const researchers = [
    { 
      id: "RES-001", 
      name: "Dr. Jane Smith", 
      department: "Computer Science", 
      role: "Principal Investigator",
      publications: 24,
      projects: 3,
      status: "Active"
    },
    { 
      id: "RES-002", 
      name: "Dr. Robert Johnson", 
      department: "Physics", 
      role: "Co-Investigator",
      publications: 18,
      projects: 2,
      status: "Active"
    },
    { 
      id: "RES-003", 
      name: "Dr. Emily Davis", 
      department: "Environmental Science", 
      role: "Research Fellow",
      publications: 12,
      projects: 1,
      status: "Active"
    },
    { 
      id: "RES-004", 
      name: "Dr. Michael Wilson", 
      department: "Biology", 
      role: "Visiting Scholar",
      publications: 8,
      projects: 1,
      status: "Active"
    },
    { 
      id: "RES-005", 
      name: "Dr. Sarah Brown", 
      department: "Engineering", 
      role: "Principal Investigator",
      publications: 31,
      projects: 4,
      status: "On Leave"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Researchers</h1>
        <p className="text-muted-foreground">
          Manage researcher profiles, track activity, and monitor contributions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {researcherStats.map((stat, index) => (
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
            <CardTitle>Researcher Activity</CardTitle>
            <CardDescription>
              Active researchers and new additions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={researcherActivity}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#3b82f6" name="Active Researchers" />
                <Bar dataKey="new" fill="#10b981" name="New Researchers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common researcher management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Researcher
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Researchers
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Department
              </Button>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Researchers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Researcher Directory</CardTitle>
          <CardDescription>
            List of all researchers with key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {researchers.map((researcher, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{researcher.name}</p>
                  <p className="text-xs text-muted-foreground">{researcher.id} • {researcher.department}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium">{researcher.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Publications</p>
                    <p className="text-sm font-medium">{researcher.publications}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <p className="text-sm font-medium">{researcher.projects}</p>
                  </div>
                  <Badge 
                    variant={
                      researcher.status === "Active" 
                        ? "default" 
                        : researcher.status === "On Leave" 
                        ? "secondary" 
                        : "outline"
                    }
                  >
                    {researcher.status}
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