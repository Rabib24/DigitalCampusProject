"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  MessageCircle
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResearchCollaborationView() {
  const collaborationStats = [
    {
      title: "Active Collaborations",
      value: "24",
      change: "+3 from last month",
      icon: Users
    },
    {
      title: "Researchers Involved",
      value: "89",
      change: "+5 from last week",
      icon: Users
    },
    {
      title: "Institutions",
      value: "12",
      change: "+1 from new partnership",
      icon: Users
    },
    {
      title: "Joint Publications",
      value: "32",
      change: "+4 from last quarter",
      icon: Users
    }
  ];

  const collaborationTrends = [
    { month: "Jan", collaborations: 15, publications: 4 },
    { month: "Feb", collaborations: 16, publications: 5 },
    { month: "Mar", collaborations: 18, publications: 6 },
    { month: "Apr", collaborations: 19, publications: 7 },
    { month: "May", collaborations: 21, publications: 8 },
    { month: "Jun", collaborations: 24, publications: 9 }
  ];

  const collaborations = [
    { 
      id: "COL-001", 
      title: "AI in Healthcare Partnership", 
      institutions: ["IUB", "Medical Center", "Tech University"],
      startDate: "2023-01-15",
      endDate: "2024-01-15",
      status: "Active",
      publications: 3
    },
    { 
      id: "COL-002", 
      title: "Sustainable Energy Research", 
      institutions: ["IUB", "Energy Institute", "Environmental Agency"],
      startDate: "2023-03-01",
      endDate: "2024-03-01",
      status: "Active",
      publications: 2
    },
    { 
      id: "COL-003", 
      title: "Quantum Computing Initiative", 
      institutions: ["IUB", "Physics Lab", "Computing Center"],
      startDate: "2023-05-01",
      endDate: "2024-05-01",
      status: "New",
      publications: 0
    },
    { 
      id: "COL-004", 
      title: "Climate Change Study", 
      institutions: ["IUB", "Environmental Agency", "Research Institute"],
      startDate: "2022-09-01",
      endDate: "2023-09-01",
      status: "Completed",
      publications: 5
    },
    { 
      id: "COL-005", 
      title: "Biomedical Engineering", 
      institutions: ["IUB", "Medical School", "Engineering Dept"],
      startDate: "2023-02-01",
      endDate: "2024-02-01",
      status: "Active",
      publications: 1
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research Collaboration Platform</h1>
        <p className="text-muted-foreground">
          Manage research collaborations, track partnerships, and facilitate joint projects.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {collaborationStats.map((stat, index) => (
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
            <CardTitle>Collaboration Trends</CardTitle>
            <CardDescription>
              Active collaborations and joint publications over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={collaborationTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collaborations" fill="#3b82f6" name="Collaborations" />
                <Bar dataKey="publications" fill="#10b981" name="Publications" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common collaboration management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Collaboration
              </Button>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Collaborations
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Status
              </Button>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Partners
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Research Collaborations</CardTitle>
          <CardDescription>
            List of active and past research collaborations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {collaborations.map((collaboration, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{collaboration.title}</p>
                  <p className="text-xs text-muted-foreground">{collaboration.id}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {collaboration.institutions.map((institution, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {institution}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Period</p>
                    <p className="text-sm font-medium">{collaboration.startDate} to {collaboration.endDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Publications</p>
                    <p className="text-sm font-medium">{collaboration.publications}</p>
                  </div>
                  <Badge 
                    variant={
                      collaboration.status === "Active" 
                        ? "default" 
                        : collaboration.status === "New" 
                        ? "secondary" 
                        : collaboration.status === "Completed" 
                        ? "outline" 
                        : "destructive"
                    }
                  >
                    {collaboration.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-4 w-4" />
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